# Match the eleven jumps in Coumbe's table 2.3 to hops between the two code-1200 planes in the FAA printout.
# rows.csv: the two planes' returns, 02:24:59 to 02:28:38 UTC, read from 733667-001-019.pdf pages 9-11 and checked against the scans.
# Run: python3 match.py
import csv,math
def s(t): h,m,x=t.split(':'); return int(h)*3600+int(m)*60+float(x)
def xy(r,a): th=a*2*math.pi/4096; return (r*math.sin(th), r*math.cos(th))
rows=[dict(k=r['plane'],t=s(r['time_utc']),r=float(r['range_nm']),acp=int(r['acp'])) for r in csv.DictReader(open('rows.csv'))]
for p in rows: p['x'],p['y']=xy(p['r'],p['acp'])
rows.sort(key=lambda p:p['t'])
hops=[]
for i,p in enumerate(rows):
    for q in rows[i+1:]:
        if q['t']-p['t']>15: break
        if p['k']!=q['k']:
            d=math.dist((p['x'],p['y']),(q['x'],q['y']))*1852; dt=q['t']-p['t']
            # second route: law of cosines on range and angle
            dth=(q['acp']-p['acp'])*2*math.pi/4096
            d2=math.sqrt(p['r']**2+q['r']**2-2*p['r']*q['r']*math.cos(dth))*1852
            assert abs(d-d2)<1e-6
            hops.append(dict(p=p,q=q,dt=dt,d=d,g=4*d/dt**2/9.81))
T=[(14.5,130877.5,None,2500),(9.4,132695.8,28229,6006),(14.7,130391.4,17717,2407),(14.3,127764.1,17893,2506),(2.3,126912.0,109643,94724),
   (9.8,127865.6,26176,5358),(14.1,123601.7,17540,2489),(9.8,125599.5,25709,5262),(2.3,124748.7,107542,92708),(9.8,125466.0,25683,5258),(2.3,134149.1,119137,105806)]
match=[]; used=set()
for n,(t,sd,v,a) in enumerate(T,1):
    tp = 2*sd/v if v else math.sqrt(4*sd/a)      # J1's speed in the table is a typo (180,860)
    # the hop nearest in distance among those within 5 ms of the jump's time, each hop used once
    c=sorted([h for h in hops if abs(h['dt']-tp)<0.005 and id(h) not in used],key=lambda h:abs(h['d']-sd))
    h=c[0]; used.add(id(h))
    match.append(dict(n=n,ct=t,ctp=round(tp,3),cd=sd,cg=a/9.81,ht=h['dt'],hd=h['d'],hg=h['g'],t0=h['p']['t'],t1=h['q']['t'],k0=h['p']['k'],
                      x0=h['p']['x'],y0=h['p']['y'],x1=h['q']['x'],y1=h['q']['y']))
    print(f"J{n:2d} book {tp:7.3f}s {sd:9.1f}m {a/9.81:6.0f}g | hop {h['p']['k']}->{h['q']['k']} {h['dt']:7.3f}s {h['d']:9.1f}m {h['g']:6.0f}g | dt {1000*(h['dt']-tp):+.0f} ms, d {h['d']-sd:+.1f} m ({100*(h['d']-sd)/sd:+.3f}%)")
