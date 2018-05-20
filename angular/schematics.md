# Schematics

## What's Schematics

Schematics is a better workflow tool, providing a more powerful and generic facility to support the CLI scaffolding.

## Core Concepts

- Schematics

A generator that execute descriptive code without side effects on an existing file system.

- Tree

A staging area for changes, containing the original file system, and a list of changes to apply to it.

The Tree is a data structure that contains a base (a set of files that already exists) and a staging area (a list of changes to be applied to the base)

- Rule

A function that applies actions to a Tree. It returns a new Tree that will contain all transformations to be applied.

A Rule is a function that takes a Tree and returns another Tree

- RuleFactory

RuleFactory, as the name implies, are functions that create a Rule.

```ts
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function myComponent(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create(options.name || 'hello', 'world');
    return tree;
  };
}
```

- Source

A function that creates an entirely new Tree from an empty filesystem. For example, a file source could read files from disk and create a Create Action for each of those.

- Action

A atomic operation to be validated and committed to a filesystem or a Tree. Actions are created by schematics.

- Collection

Schematics Collections are sets of named schematics, that are published and installed by users.

A list of schematics metadata. Schematics can be referred by name inside a collection.

- Tool

The code using the Schematics library.

- Atomicity
- Dry-Run

- Sink

The final destination of all Actions.

## Install

```shell
$ npm install -g @angular-devkit/schematics-cli
```

Create a blank schematics.

```shell
$ schematics blank --name=hello-world
```

Create a schematic schematics.

```shell
$ schematics schematic --name=start-up
```

## Use

```shell
$ schematics .:hello-world
```

Using in another app.

```shell
$ npm install hello-world
```

or

```shell
$ npm link ../hello-world
$ schematics hello-world:hello-world
```

First name is the package and the second name is the code generator.

## Custom your own

- Example Covering all cases(take time for reviews, less is more)
- Finding Variation Points
- Define Model to Describe Variation Points
- Write and Test Generator

## Reference

- https://www.npmjs.com/package/@angular-devkit/schematics
- https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2
- https://www.youtube.com/watch?v=JAt1FSwhnWk
- https://speakerdeck.com/manfredsteyer/custom-schematics-an-angular-application-by-the-push-of-a-button-with-the-clis-code-generator
- https://www.youtube.com/watch?v=LZxbDp1nOVo&t=2224s