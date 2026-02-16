const iterations = 100000;
const text = '<p>This is a <strong>sample</strong> text with <a href="#">some links</a> and <em>formatting</em>.</p>'.repeat(10);

console.time('Old Regex');
const oldRegex = /<(.|\n)*?>/g;
for (let i = 0; i < iterations; i++) {
    text.replace(oldRegex, '');
}
console.timeEnd('Old Regex');

console.time('New Regex');
const newRegex = /<[^>]*>/g;
for (let i = 0; i < iterations; i++) {
    text.replace(newRegex, '');
}
console.timeEnd('New Regex');

console.time('Old Regex (Instantiated in loop)');
for (let i = 0; i < iterations; i++) {
    text.replace(/<(.|\n)*?>/g, '');
}
console.timeEnd('Old Regex (Instantiated in loop)');
