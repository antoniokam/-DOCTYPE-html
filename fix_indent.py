filepath = "!DOCTYPE html.html"
with open(filepath, 'rb') as f:
    content = f.read().decode('utf-8')

content = content.replace("const renderNodeData = (node) => {", "            const renderNodeData = (node) => {")

with open(filepath, 'wb') as f:
    f.write(content.encode('utf-8'))
