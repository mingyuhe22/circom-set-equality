# circom-set-equality

Implementation of "Set Equality" operations in circom.

# Project overview

This project demonstrates how to use PCP concepts and The Fiat-Shamir Transformation to prove that two sets are equal. 

Generally speaking, the complexity of such circuits is $O(n^2)$, but we can use the concept of PCP to reduce the complexity to $O(n)$. 

This project shows how to implement such circuits using circom.

# Testing

```
npm run test
```

# Benchmark

The following tests are for comparing whether two sets of size 1000 are equal.

||non-linear constraints|wires|labels|
|-|-|-|-|
|"set_equality"|1998|3999|4002|
|"set_equality_fs"|83568|85568|501080|
|Traditional approach|2000000|2001001|7002002|

# Mathematical derivation

## Subgroup check

### Setting
Given 
$a := \{a_0, a_1, ..., a_{k - 1}\}$,
$b := \{b_0, b_1, ..., b_{m - 1}\}$

Build a polynomial $A$ to represent $a$ and $B$ to represent $b$.

$$ A(x) := \prod_{i \in \mathbb{Z}_k}{(x - a_i)} $$
$$ B(x) := \prod_{i \in \mathbb{Z}_m}{(x - b_i)} $$

Then $b$ is a subgroup of $a$ iff $B(x) | A(x)$

### Protocol

1.  Given $A(x)$, $B(x)$
2.  Bob want to check if $b$ is a subgroup of $a$
3.  Bob pick a random $r \in \mathbb{Z}_p$ and send to Alice
4.  Alice calc $\pi_H := H(r)$, where $H(x) := \frac{A(x)}{B(x)}$
5.  Alice send $\pi_H$ to Bob
6.  Bob calc $\pi_A := A(r)$, $\pi_B := B(r)$
7.  Bob check if $e(\pi_A, \mathbb{G}) = e(\pi_B, \pi_H)$

If $a = b$, then $H(x) = 1$

## Set Equality

Given
$a := \{a_0, a_1, ..., a_{k - 1}\}$,
$b := \{b_0, b_1, ..., b_{m - 1}\}$

Build a polynomial $A$ to represent $a$ and $B$ to represent $b$.

$$ A(x) := \prod_{i \in \mathbb{Z}_k}{(x - a_i)} $$
$$ B(x) := \prod_{i \in \mathbb{Z}_m}{(x - b_i)} $$

If $a = b$, then $A(x) = B(x)$.

### Definition

$$ (A = B) := (\forall r \in \mathbb{Z}_p, A(r) = B(r)) $$

### Protocol

1.  Pick a random $r \in \mathbb{Z}_p$
2.  Check if $A(r) = B(r)$

### Soundness Error

If $A \neq B$, then $A(r) \neq B(r)$ with probability $\frac{1}{p}$

## Set Equality 

### Protocol

1.  Define  $r = Hash([..A, ..B])$
2.  Check if $A(r) = B(r)$

## Permutation

Given 
$ i \mapsto \alpha_i $,
$ j \mapsto \beta_j $

Define

$$
a = \{\forall i \in \mathbb{Z}_k|(i, \alpha_i)\} \\
b = \{\forall j \in \mathbb{Z}_m|(j, \beta_j)\}
$$

### Lemma

$$ \forall s \in \mathbb{Z}_p, (x - x_0) + s(y - y_0) = 0 \leftrightarrow ((x, y) = (x_0, y_0))$$

So, we can use $x + sy$ to represent the $a$ and $b$.

### Lemma

Pick random $s \in \mathbb{Z}$, Define

$$
a = \{\forall i \in \mathbb{Z}_k|i + s\alpha_i\} \\
b = \{\forall j \in \mathbb{Z}_m|j + s\beta_j \}
$$

Build a polynomial $A$ to represent $a$ and $B$ to represent $b$.

$$ A(x) := \prod_{i \in \mathbb{Z}_k}{(x - (i + s\alpha_i))} $$
$$ B(x) := \prod_{i \in \mathbb{Z}_m}{(x - (j + s\beta_j))} $$

Then $a = b$ iff $B(x) = A(x)$

### Definition

$$ (A = B) := (\forall r \in \mathbb{Z}_p, A(r) = B(r)) $$

### Protocol

..todo

