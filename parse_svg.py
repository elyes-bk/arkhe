import re

path = "C:/Users/ebenk/Downloads/Demande enregistré mobile.svg"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

vb = re.search(r'viewBox=["\']([^"\']*)["\']', content)
print('viewBox:', vb.group(1) if vb else 'not found')

rects = re.findall(r'<rect[^>]*/>', content) + re.findall(r'<rect[^>]*>', content)
print(f'\nTotal rects: {len(rects)}')
for r in rects[:50]:
    x = re.search(r'\bx=["\']([^"\']+)', r)
    y = re.search(r'\by=["\']([^"\']+)', r)
    w = re.search(r'\bwidth=["\']([^"\']+)', r)
    h = re.search(r'\bheight=["\']([^"\']+)', r)
    fill = re.search(r'\bfill=["\']([^"\']+)', r)
    rx = re.search(r'\brx=["\']([^"\']+)', r)
    print(f'  x={x.group(1) if x else "0":>6} y={y.group(1) if y else "0":>6} w={w.group(1) if w else "?":>6} h={h.group(1) if h else "?":>6} fill={fill.group(1) if fill else "none"} rx={rx.group(1) if rx else "0"}')
