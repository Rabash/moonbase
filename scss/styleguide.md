# Introduction

This is a style guide for your website. Here are all the style elements that are developed, and they serves as a reference point for all those who in some way are working with the website. A style guide is a living documentation developed side by side with the website.

Purpose of the style guide:
* to document and get an overview of all components
* to create a consistent use of the style elements
* to encourage and facilitate code reuse

## This should be the canonical example
For nearly every component of this site, this style guide should be the canonical example. This allows editors, designers, developers, and everyone else access to see how components should look and/or work.

The content of this style guide is recreated every time that this project's `gulp styleguide` task runs. As more work is done, more components will be added here.

---


# For developers
Before continuing, you should have a general understanding for specificity, the [SCSS syntax](http://sass-lang.com/), and [KSS documentation](https://github.com/kneath/kss).

## Gulp

## Coding style
We are inspired by, and mostly following [Sass Guidelines](http://sass-guidelin.es/) by [Hugo Giraudel](http://hugogiraudel.com/).

### Syntax and formatting

Generally, we want:

* two (2) spaces indents, no tabs;
* ideally, 80-characters wide lines;
* properly written multi-line CSS rules;
* meaningful use of whitespace;
* strings and urls should always be wrapped with single quotes.

### Naming conventions
We use [BEVM](http://webuild.envato.com/blog/chainable-bem-modifiers/), an extension of [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) with [namespaces](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/) and [BEMIT](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/) to make the css both readable and modular.

#### BEVM
Example of BEVM:

    .block {}
    .block__element {}
    .block--variant {}
    .block__element--variant {}
    .block--variant.-modifier {}

#### Namespaces
We use the following namespaces:

* Object (o-)
* Component (c-)
* Utility, also known as helper (u-)
* Hack (_)
* JavaScript (js-)

[More detailed introduction to these namespaces.](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/#the-namespaces)

#### BEVM & namespaces
Example of BEVM with namespaces:

    .c-block {}
    .c-block.-modifier {}
    .c-block__element {}
    .c-block--variant {}
    .c-block__element--variant {}
    .c-block--variant.-modifier {}
    .c-block--variant.is-open {}
    .c-block.js-accordion {}

#### Responsive Suffixes
Example of BEVM with namespaces and responsive suffixes:

    .o-object\@xlarge {}

#### Single class vs multiple classes
We use single classes as 'variations' and multiple classes as 'chainable modifiers'. We never use both 'block'-class and 'variant'-classes on the same element. If it has a variation, use only that class.

### Architecture
The CSS architecture is based on [Inverted Triangle CSS](http://www.creativebloq.com/web-design/manage-large-scale-web-projects-new-css-architecture-itcss-41514731)
by [Harry Roberts](https://twitter.com/csswizardry/).
It is layer-based architecture that goes from generic css to explicit,
low specificity to high specificity.

#### Settings
This holds all global settings that need to be accessed from anywhere.
Examples of settings: font-families, color palettes, configurations.

#### Tools
Tools are globally available tools like mixins and functions.
Tools that does not need accessing globally belongs in
the partial to which it relates.
Examples of tools: font-sizing mixins, breakpoint mixins.

#### Generic
This is the first layer that actually produces css.
Here you can find very high-level, far reaching styles.
This layer is rarely modified and you' won't find any classes here.
Examples: resets, sanitize.

#### Elements
These are bare, unclassed HTML elements,
slightly more specific than the generic layer.
What does a blockquote look like without classes?
This is the last layer you'll find bare, element-based selectors.
Examples: h1, blockquote, ul, image.

#### Objects
This is the first layer in which we find class-based selectors.
These are concerned with styling non-cosmetic design patterns, or ‘objects’.
Examples: wrappers, grids.
**Prefixed with o-**

#### Components
This layers holds the cosmetic design patterns. This is where most of the
work will happen.
Examples: icons, menus, pagination.
**Prefixed with c-**

#### Trumps
This layers beats all other layers.
It contains utility and helper classes, hacks and overrides.
**Prefixed with u-**

### Commenting
We use [KSS](https://github.com/kneath/kss) for commenting css, and generating documentation.

#### SassDoc
We use [SassDoc](http://sassdoc.com/) for commenting and generating sass-specific documentation, like mixins and variables. These are not included here. **The SassDoc comments are inline with three slashes (///)**.

Example:

    /// Font size in em.
    /// @param {Number} $target-px - The font-size in pixels you want
    /// @param {Number} $context [$root-font-size] - The font-size of the context you are in
    @function pxtoem($target-px, $context: $root-font-size) {
      @return $target-px / $context * 1em;
    }
