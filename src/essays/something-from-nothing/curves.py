"""Entropy per atom, S/(N k), of argon at fixed T and p, counted four ways, as a function of N.
All exact (log-gamma), no Stirling. Used for the essay's figure; also checks the large-N limit
against the tabulated standard entropy of argon (NIST: 154.846 J/mol/K at 298.15 K, 1 bar)."""
import math
k = 1.380649e-23; h = 6.62607015e-34; u = 1.66053906660e-27; R = 8.314462618
m = 39.948 * u

def parts(T, p):
    n = p / (k * T)                       # number density
    q = 2 * math.pi * m * k * T / h**2    # (1/lambda^2)
    return n, q

def s_canonical(N, T=298.15, p=1e5):
    n, q = parts(T, p)
    V = N / n
    lnZ = N * math.log(V) - math.lgamma(N + 1) + 1.5 * N * math.log(q)
    return lnZ / N + 1.5

def s_ball(N, T=298.15, p=1e5):
    # all states with energy up to E = (3/2) N k T
    n, q = parts(T, p)
    V = N / n
    E = 1.5 * N * k * T
    lnO = (N * math.log(V) - math.lgamma(N + 1)
           + 1.5 * N * math.log(2 * math.pi * m * E / h**2) - math.lgamma(1.5 * N + 1))
    return lnO / N

def s_shell(N, delta=1e-6, **kw):
    # only states within a fraction delta of E (an absurdly sharp energy)
    M = 1.5 * N
    frac = -math.expm1(M * math.log1p(-delta))   # 1 - (1-delta)^M
    return s_ball(N, **kw) + math.log(frac) / N

def s_two_kinds(N, **kw):
    # an observer who can tell two kinds of atom apart, N/2 each: the mixing term ln C(N, N/2), about N ln 2
    return s_canonical(N, **kw) + (math.lgamma(N + 1) - 2 * math.lgamma(N / 2 + 1)) / N

if __name__ == "__main__":
    # the instrument check: Sackur-Tetrode limit vs the tables
    big = 1e24
    for name, f in [("canonical", s_canonical), ("ball", s_ball), ("shell", s_shell)]:
        s = f(big, T=298.15)
        print(f"{name:10s} N=1e24, 298.15 K: S/Nk = {s:.4f}  -> {s*R:.3f} J/mol/K (NIST 154.846)")
    print("two kinds  - canonical at 1e24:", s_two_kinds(big) - s_canonical(big), " ln2 =", math.log(2))
    for N in [1, 2, 10, 100, 1e3, 1e4, 1e6, 1e9, 1e12, 1e23]:
        print(f"N={N:8.0e}  can {s_canonical(N):7.3f}  ball {s_ball(N):7.3f}  shell {s_shell(N):7.3f}  two {s_two_kinds(N) if N>=2 else float('nan'):7.3f}")
