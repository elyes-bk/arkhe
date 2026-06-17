import re

path = "C:/Users/ebenk/Downloads/Demande enregistré mobile.svg"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract tspan text
tspans = re.findall(r'<tspan[^>]*>([^<]+)</tspan>', content)
print("=== TSPAN TEXTS ===")
for t in tspans[:80]:
    t = t.strip()
    if t:
        print(f'  "{t}"')

# Look for linear gradients to understand card colors
print("\n=== GRADIENTS ===")
grads = re.findall(r'<linearGradient[^>]*>.*?</linearGradient>', content, re.DOTALL)
for g in grads[:5]:
    gid = re.search(r'id=["\']([^"\']+)', g)
    stops = re.findall(r'<stop[^>]*>', g)
    print(f'  id={gid.group(1) if gid else "?"}')
    for s in stops:
        off = re.search(r'offset=["\']([^"\']+)', s)
        col = re.search(r'stop-color["\s]*[:=]["\s]*([^;"\']+)', s)
        print(f'    stop offset={off.group(1) if off else "?"} color={col.group(1).strip() if col else "?"}')
