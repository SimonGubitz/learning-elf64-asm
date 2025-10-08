# Debug

possible problem:

```nasm
mov byte[rsi+rdi], dl
```

is not the same as

```nasm
mov byte[itoa_buff+rdi], dl
```

even with setting

```nasm
mov rsi, itoa_buff
```

is the fix

```nasm
lea rsi, itoa_buff
```

## Findings

because debugging revealed a correct calculation for `dl`
