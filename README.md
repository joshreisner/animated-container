# Animated Grid

The interaction pattern was inspired by [Isotope](https://isotope.metafizzy.co/) by Dave DeSandro.

## Approach

Two ideas for a project architecture:

- **always render all the items**
  what you're seeing is the items always position absolute, and we have resize handlers to maintain.

  - pros: simple
  - cons: when there's a resize it will animate, like isotope does. if we reorder the
    tabindex will be out of order (although currently not reordering)

- **maintain two grids**
  show a "shadow" grid at rest, then, when there's a change, briefly switch to "all items" grid to run the animation, then swap back
  - pros: resizes fluidly, maintains correct dom order
  - cons: swapping visible dom elements means that if you focus during an animation it's lost (could apply `tabIndex=-1` probably)
  - 🥇 this option picked by team 5/6/22

### Anatomy of a transition:

- at rest (no status)
  - shadowgrid is showing
  - maintain array of refs to each item, and ref to the grid
  - no need for resize handlers
  - useeffect with no dependencies to cleartimeout if it exists
- render the shadowgrid `status=calculating`
  - determine which items are leaving
  - determine which items are entering, and at where
  - determine which items are moving, and to where
  - set status = `preflight`, items = both new and old items
- freeze the existing grid in place `status=preflight`
  - set everything position=absolute with current xy
  - insert new elements at the positions they need to go, hidden
- run transition `status=running`
  - set transition css property
  - set new xy / opacity / scale properties
- clean up
  - set children in the proper order
  - remove all properties

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
