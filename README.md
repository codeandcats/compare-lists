## compare-lists

Super efficiently compares two sorted lists (arrays, strings, anything that is iterable actually).

<center>
	<img src="https://raw.githubusercontent.com/codeandcats/compare-lists/master/img/visualisation.png" />
</center>

[![npm version](https://badge.fury.io/js/compare-lists.svg)](https://badge.fury.io/js/compare-lists)
[![Build Status](https://travis-ci.org/codeandcats/compare-lists.svg?branch=master)](https://travis-ci.org/codeandcats/compare-lists)
[![Coverage Status](https://coveralls.io/repos/github/codeandcats/compare-lists/badge.svg?branch=master)](https://coveralls.io/github/codeandcats/compare-lists?branch=master)

### Install

```sh
npm install compare-lists --save
```

### Usage

```typescript
import { compareLists } from "compare-lists";
```

Say you have two sorted lists of filenames and you need to know which files exist in the left list, which exist in the right list, and which exist in both lists.

```typescript
const leftList = [
  "documents/apples.txt",
  "documents/funny-cats.mp4",
  "documents/funny-dogs.avi",
  "trash/linux.iso",
  "trash/zebras.doc"
];

const rightList = [
  "documents/apples.txt",
  "documents/funny-cats.mp4",
  "documents/taxes.doc",
  "trash/linux.iso",
  "trash/zebras.doc"
];
```

Just call `compareLists` passing both the lists, a function to compare items in each list and handlers for any events that you're interested in.

```typescript
compareLists({
  left: leftList,
  right: rightList,
  compare: (left, right) => left.localeCompare(right),

  onMatch: value => console.log(`"${value}" is found in both lists`),
  onMissingInLeft: right =>
    console.log(`"${right}" is missing in the left list`),
  onMissingInRight: left =>
    console.log(`"${left}" is missing in the right list`)
});
```

The output will be:

```
"documents/apples.txt" is found in both lists
"documents/funny-cats.mp4" is found in both lists
"documents/funny-dogs.avi" is missing in the right list
"documents/taxes.doc" is missing in the left list
"trash/linux.iso" is found in both lists
"trash/zebras.doc" is found in both lists
```

That's the basics!

### More...

#### Simple API

Alternatively, you can ask for a "report" instead of handling events. Just keep in mind this will use more memory than simply handling events.

```typescript
const report = compareLists({
  left: leftList,
  right: rightList,
  compare: (left, right) => left.localeCompare(right),

  returnReport: true
});

console.log(JSON.stringify(report, null, "  "));
```

```json
{
  "missingInLeft": ["documents/taxes.doc"],
  "missingInRight": ["documents/funny-dogs.avi"],
  "matches": [
    ["documents/apples.txt", "documents/apples.txt"],
    ["documents/funny-cats.mp4", "documents/funny-cats.mp4"],
    ["trash/linux.iso", "trash/linux.iso"],
    ["trash/zebras.doc", "trash/zebras.doc"]
  ]
}
```

#### The two lists can be different types

The left and right lists do not need to be the same type as each other. Just remember the items still need to by sorted by the field you are comparing on.

```typescript
const leftList = [{ name: "Morty Smith" }, { name: "Rick Sanchez" }];
const rightList = ["Morty Smith", "Mr. Poopy Butthole"];

const report = compareLists({
  left: leftList,
  right: rightList,
  compare: (left, right) => left.name.localeCompare(right),
  returnReport: true
});

console.log(JSON.stringify(report, null, "  "));
```

Will output:

```json
{
  "missingInLeft": ["Mr. Poopy Butthole"],
  "missingInRight": [{ "name": "Rick Sanchez" }],
  "matches": [[{ "name": "Morty Smith" }, "Morty Smith"]]
}
```

#### Comparing lists other than arrays

The library works with any objects that implement the iterable protocol, including arrays, strings, maps, etc.

Here is an example of comparing characters in two strings:

```typescript
const left = "abcdef";
const right = "abcxyz";

const report = compareLists({
  left,
  right,
  compare: (left, right) => left.localeCompare(right)
});

console.log(JSON.stringify(report, null, "  "));
```

Will output:

```json
{
  "missingInLeft": ["x", "y", "z"],
  "missingInRight": ["d", "e", "f"],
  "matches": [
    ["a", "a"],
    ["b", "b"],
    ["c", "c"]
  ]
}
```

#### Comparing two iterators

There is also a handy `compareIterators` function if you need it.
Don't forget the values need to be in ascending order!

```typescript
import { compareIterators } from "compare-lists";

const leftIterator = function*() {
  yield "a";
  yield "b";
  yield "c";
};

const rightIterator = function*() {
  yield "a";
  yield "c";
  yield "d";
};

const report = compareIterators({
  left: leftIterator(),
  right: rightIterator(),
  compare: (left, right) => left.localeCompare(right),
  returnReport: true
});

console.log(JSON.stringify(report, null, "  "));
```

Will output:

```json
{
  "missingInLeft": ["d"],
  "missingInRight": ["b"],
  "matches": [
    ["a", "a"],
    ["c", "c"]
  ]
}
```

## Contributing

Got an issue or a feature request? [Log it](https://github.com/codeandcats/compare-lists/issues).

[Pull-requests](https://github.com/codeandcats/compare-lists/pulls) are also welcome. 😸
