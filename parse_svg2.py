import re

path = "C:/Users/ebenk/Downloads/Demande enregistré mobile.svg"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all text content (between tspan or text tags)
texts = re.findall(r'<text[^>]*>(.*?)</text>', content, re.DOTALL)
print("=== TEXTS ===")
for t in texts[:60]:
    clean = re.sub(r'<[^>]+>', '', t).strip()
    if clean:
        print(f'  "{clean}"')

# Extract circles
print("\n=== CIRCLES ===")
circles = re.findall(r'<circle[^>]*/>', content)
for c in circles[:20]:
    cx = re.search(r'\bcx=["\']([^"\']+)', c)
    cy = re.search(r'\bcy=["\']([^"\']+)', c)
    r = re.search(r'\br=["\']([^"\']+)', c)
    fill = re.search(r'\bfill=["\']([^"\']+)', c)
    stroke = re.search(r'\bstroke=["\']([^"\']+)', c)
    print(f'  cx={cx.group(1) if cx else "?"} cy={cy.group(1) if cy else "?"} r={r.group(1) if r else "?"} fill={fill.group(1) if fill else "none"} stroke={stroke.group(1) if stroke else "none"}')
