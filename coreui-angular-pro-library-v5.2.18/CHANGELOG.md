### [@coreui/angular-pro](https://coreui.io/angular/) changelog

---

#### `5.2.18`

- chore(dependencies): update to Angular `18.2.5`
- fix(progress-bar): bar animation fails for no style width on 0 percent
- refactor(popover): use ComponentRef setInput() api, input signals, host bindings
- refactor(tooltip): use ComponentRef setInput() api, input signals, host bindings
- refactor(toast): use ComponentRef setInput() api, input signals
- refactor(multi-select): use ComponentRef setInput() api
- fix(widget-stat-f): rounded-start-1 bg for icon without padding, text-color for value prop
- refactor(callout): input signals, host bindings
- refactor(card-header-actions): host bindings
- refactor(card-img): input signals, host bindings
- refactor(card): host bindings
- refactor(input-group): input signals, host bindings
- refactor(container): input signals, host bindings
- refactor(header): input signals, host bindings
- refactor(widgets): input signals, host bindings
- refactor(collapse): input signals, host bindings

---

#### `5.2.17`

- refactor(img): input signals, host bindings
- refactor(list-group): input signals, host bindings
- chore(dependencies): update to Angular `18.2.2`
  - see also: vulnerability [Webpack AutoPublicPathRuntimeModule has a DOM Clobbering Gadget that leads to XSS](https://github.com/advisories/GHSA-4vvj-4cpr-p986)

---

#### `5.2.16`

- refactor(footer): input signals, host bindings
- refactor(placeholder): input signals, host bindings
- chore(dependencies): update `eslint` to `^9.9.1`
- chore(dependencies): update `typescript-eslint` to `~8.3.0`
- chore(dependencies): update `tslib` to `^2.7.0`
- chore(dependencies): update `micromatch` to `4.0.8` 
  - see also: vulnerability [Regular Expression Denial of Service (ReDoS) in micromatch](https://github.com/advisories/GHSA-952p-6rrq-rcjv)

---

#### `5.2.15`

- refactor(button): input signals, host bindings
- refactor(button-close): input signals, host bindings
- refactor(avatar): host bindings
- refactor(badge): host bindings
- chore(dependencies): update to Angular `18.2.1`
- chore(dependencies): update to typescript-eslint `~8.2.0`
- fix(schematics): outDir

---

#### `5.2.14`

- chore(dependencies): update to Angular `18.2`
- chore(dependencies): update to typescript `~5.5.4`
- chore(dependencies): update to typescript-eslint `~8.1.0`
- chore(dependencies): update to angular-eslint `~18.3.0`
- refactor(button): input signals, host bindings
- refactor(button-close): input signals, host bindings
- refactor(loading-button): input signals, host bindings

---

#### `5.2.13`

- chore(dependencies): update
- chore(karma.conf): add custom chrome launcher with `--disable-search-engine-choice-screen` flag
- refactor: remove empty constructors, wrapper components host class cleanups
- chore(eslint): update `eslint` to v9, `angular-eslint`, `typescript-eslint`
- refactor: eslint minor syntax cleanups

---

#### `5.2.11`

- feat(schematics): ng-add basic integration 
- chore(dependencies): update

---

#### `5.2.7`

- fix(multi-select): form control value not cleared on empty control value
- chore(dependencies): update

---

#### `5.2.6`

- fix(multi-select): options not cleared on multiSelectOptionsContent change
- chore(dependencies): update

---

#### `5.2.5`

- chore(dependencies): update to Angular 18.1
- refactor: update calls to `afterRender` with an explicit phase to the new API
- refactor(avatar): for src add deferrable view with placeholder

---

#### `5.2.4`

- fix(date-range-picker): manual date input does not update form control value, refactor
- chore(dependencies): update

---

#### `5.2.3`

- chore(dependencies): update
- refactor(accordion): minor cleanup, add host class metadata
- refactor(avatar): template default ng-content, host class metadata, input signals
- refactor(badge): host class metadata, input signals
- refactor(card): host class metadata, input signals
- refactor(text-bg-color): input signals
- refactor(text-color): input signals
- refactor(widget-stat-b): input signals
- refactor(modal): minor syntax cleanup

---

#### `5.2.2`

- chore(dependencies): update
- fix(tab.directive): missing `disabled` attribute

---

#### `5.2.1`

- chore(dependencies): update(`ws` vulnerability)
- fix(tabs2): missing `exportAs`
- fix(multi-select): minWidth for options with `virtualScroller`

---

#### `5.2.0`

- chore(dependencies): update to `Angular 18`
- chore(dependencies): update to `CoreUI Pro v5.2`
- fix(calendar): NG0955 - Track expression resulted in duplicated keys for a given collection
- feat(tabs): Angular tabs reimagined structure, keyboard interactions and WAI-ARIA support
- fix(modal): attempt to focus when there is no focusable element on modal dialog
- fix(smart-pagination): disable first/prev - last/next button on first - last page

---

#### `5.1.2`

- chore(dependencies): update (js-yaml vulnerability)
- fix(avatar): add `alt` prop for img alternate text
- fix(footer): set default `role="contentinfo"`
- fix(header): set default `role="banner"`
- fix(sidebar-nav): set default `role="navigation"`
- fix(tab-pane): add default `role="tabpanel"`
- fix(TabContentRef): add `aria-selected` attribute and default `role="tab"`

---

#### `5.1.1`

- chore(dependencies): update
- fix(dropdown): add aria-expanded attribute, refactor

---

#### `5.1.0`

- feat: rating component
- chore(dependencies): update
- feat: element-ref directive
- feat(tooltip): reference input for positioning the tooltip on reference element, refactor with signals
- refactor(listeners.service): add focusin Trigger
- refactor(template-id.directive): cleanup, add missing test

---

#### `5.0.4`

- chore(dependencies): update
- fix(tooltip): do not show the tooltip for empty content, refactor with input()

---

#### `5.0.3`

- chore(dependencies): update
- test: add missing tests, refactor

---

#### `5.0.2`

- chore(dependencies): update
- fix(icon): cIcon directive [name] binding does not refresh icon in angular 17 #203
- refactor(icons-angular): use Angular signals
- test(icons-angular): update

---

#### `5.0.1`

- chore(dependencies): update
- fix(color-mode.service): afterNextRender() for SSR
- fix(local-storage.service): provide null for empty Storage.getItem() value

---

#### `5.0.0`

- chore(dependencies): update to `Angular 17.3`
- chore(dependencies): update to `CoreUI 5`
- refactor(sidebar): drop sidebar-toggler component, use directive instead, use control flow, use Input() transform
- refactor(widget): update to v5
- fix(tooltip): update offset for v5
- refactor(toast): use Input() transform
- feat(utilities): shadow-on-scroll directive
- refactor(tabs): use Input() transform
- refactor(table.type): Partial attributes
- feat: ThemeDirective
- feat(services): v5 color-mode, local-storage, in-memory-storage, script-injector
- refactor(progress): add progress-stacked component, update testing, rewrite with signals
- refactor(progress): add progress-bar props for simplified use with [value]
- fix(popover): update offset for v5
- refactor(placeholder): use Input() transform
- refactor(offcanvas): use ThemeDirective composition for dark prop
- refactor(navbar): colorScheme prop replaced with ThemeDirective composition
- fix(row): row-cols-n for xs="n"
- refactor(form-check-input): use Input() transform
- refactor(dropdown): allow to select a dropdown-item with up/down arrows, testing update, use Input() transform
- refactor(dropdown): implement FocusableOption interface for items
- refactor(dropdown): use ThemeDirective composition for dark prop
- refactor(collapse): use Input() transform
- refactor(carousel): control flow, use Input() transform, ThemeDirective composition for dark prop
- refactor(card): use TextColorDirective composition
- refactor(button-close): deprecate white input prop, use ThemeDirective composition for dark prop
- refactor(breadcrumb): cleanups, add routeSnapshot.title as fallback value, use control flow, use Input() transform
- refactor(badge): update TextColors, use TextColorDirective composition
- chore(backdrop.service): cleanup
- refactor(avatar): update TextColors, use TextColorDirective composition, use control flow
- refactor(alert): use Input() transform, use control flow
- refactor(coreui.types): update to v5
- refactor(accordion): use Input() transform
- refactor(chartjs): update to ChartJS 4.x, types cleanup, use afterRender for SSR
- refactor(icon): add afterNextRender for SSR, add aria-hidden attribute, improve testing
- refactor(multi-select): update to v5
- refactor(multi-select): popperOptions setter, add sameAsReferenceWidthModifier
- fix(multi-select): fix counterTextType() return value
- refactor(date-range-picker, date-picker, calendar): : update to v5
- feat(calendar): selectionType, showWeekNumber props
- feat(date-range-picker): showWeekNumber, weekNumbersLabel, selectionType props
- refactor(smart-table): update to v5
- feat(utilities): TextBgColor directive
- refactor(badge): improve background and text color handling with TextBgColor directive composition api
- refactor(card): improve background and text color handling with TextBgColor directive composition api

---

#### `4.7.18`

- chore(dependencies): update

---

#### `4.7.17`

- chore(dependencies): update to `Angular 17.3`

---

#### `4.7.16`

- chore(dependencies): update

---

#### `4.7.15`

- fix(sidebar-nav-group): typo on control flow migration - thanks @meriturva, closes #200
- chore(workflows): update github actions to v4 - checkout, setup-node

---

#### `4.7.14`

- chore(dependencies): update to `Angular 17.2`

---

#### `4.7.13`

- chore(dependencies): update
- refactor(@coreui/angular-pro): use control flow
- refactor(@coreui/angular): use control flow
- fix(chartjs): canvas already in use, refactor

---

#### `4.7.12`

- chore(dependencies): update
- fix(chartjs): use afterRender, afterNextRender fails - temp fix

---

#### `4.7.11`

- fix(multi-select): for `multiple` return an array, otherwise a single value
- chore(dependencies): update

---

#### `4.7.10`

- fix(toast): types
- fix(carousel): types
- fix(sidebar): missing export SidebarNavHelper
- chore(dependencies): update

---

#### `4.7.9`

- fix(date-range-picker): missing host binding of datePickerClasses (is-valid, is-invalid)
- fix(date-range-picker): blur does not work, listen focusout instead
- chore(dependencies): update

---

#### `4.7.8`

- refactor: allow getComputedStyle() to be undefined for SSR
- refactor(tooltip): for use with IntersectionService providedIn root
- refactor(popover): for use with IntersectionService providedIn root
- refactor(carousel): for use with IntersectionService providedIn root
- refactor(IntersectionService): providedIn root, allow multiple observers, add unobserve() method
- refactor(icon): afterNextRender in case of SSR
- refactor(chartjs): afterNextRender in case of SSR

---

#### `4.7.7`

- feat(smart-table): custom templates for column header label
- chore(dependencies): update

---

#### `4.7.5`

- fix(multi-select): option value type `string | number` 
- chore(dependencies): update

---

#### `4.7.4`

- refactor(multi-select): control flow, placeholder text, input conditional, cleanups, flex, truncate (backport from v5)
- chore(dependencies): update

---

#### `4.7.3`

- fix(multi-select-option): NG0100: Expression has changed after it was checked for hasContent and aria-selected
- fix(multi-select): NG0911: View has already been destroyed: setFocusKeyManager
- fix(backdrop): add missing export
- feat(modal): restore focus on modal hide, set focus to visible modal
- refactor(backdrop, modal, offcanvas): move scrollbar adjustments to backdrop, cleanups
- chore(dependencies): update

---

#### `4.7.2`

- perf(multi-select): use OnPush, flow-control, remove setTimeouts - use computed for tabindex and aria-selected instead
- chore(dependencies): update

---

#### `4.7.0`

- chore(dependencies): update to `Angular 17`
  - `Angular 17`
  - `TypeScript ~5.2`
  - `zone.js ~0.14.2`
- chore: update tsconfig and eslintrc
- refactor: minor cleanups - typings, tests
- chore: update `.github/workfows` for node-version 20

---

#### `4.5.28`

- chore(dependencies): update

---

#### `4.5.27`

- chore(dependencies): update

see: [Babel vulnerable to arbitrary code execution when compiling specifically crafted malicious code](https://github.com/coreui/coreui-angular/security/dependabot/31)

---

#### `4.5.26`

- fix(smart-table): add missing `_attributes` to columnDefaultTemplate `<td>` element, types update
- chore: sync with v4.5.25
- chore(dependencies): update

---

#### `4.5.25`

- feat(smart-table): add `tableSummaryRow` template
- refactor(smart-table-head): extract columnLabel as Pipe
- refactor(smart-table): minor cleanups
- chore(dependencies): update

---

#### `4.5.24`

- fix(calendar.utils): `isValidDate()` cleanup
- refactor(date-range-picker): add `CustomRangeKeyPipe`
- refactor(date-range-picker): add `showRanges`, update `breakpoints` and `layoutChanges()`

---

#### `4.5.23`

- fix(multi-select): display doubled number for `selectionType='counter'` and undefined plural map
- fix(date-range-picker): make `[locale]` prop reactive, use Angular `formatDate()`
- refactor(calendar.utils): remove date-fns `isValid()` use `isValidDate()` instead
- refactor(time.utils): remove date-fns `isDate()` use `isDateObject()` instead, code reformat
- chore(dependencies): remove `date-fns` dependency
- chore(dependencies): update
- refactor(date-range-picker): check isValidDate() on formatDate()

---

#### `4.5.22`

- feat(smart-table): add selectAll prop, _selectable for IItem
- refactor(form-check-input): indeterminate and checked props
- chore(peerDependencies): add @angular/forms
- chore(dependencies): update

---

#### `4.5.21`

- fix(multi-select-option): Cannot read properties of undefined (reading 'equal')
  - the bug introduced by @angular/core v16.2.4 and up
  - needs a reproduce scenario https://github.com/angular/angular/issues/51771#issuecomment-1729300652
- chore(dependencies): update

---

#### `4.5.20`

fix(multi-select): virtualScroller fails on options input change (relates to `54ab10c` `v4.5.17`)

---

#### `4.5.17`

- fix(multi-select): distinct changes detection on multiSelectOptionsContent fails
- refactor(multi-select): add explicit types to input properties
- chore(dependencies): update

---

#### `4.5.16`

- refactor(time-picker): select variant - drop ngModelChange, add change handlers and default validators
- fix(form-control): console.warn typo in textarea
- chore(dependencies): update

---

#### `4.5.15`

- chore(dependencies): update to Angular 16.2
- fix(icon): check name value for undefined
- fix(multi-select): clear search on added user option, remove effect

---

#### `4.5.14`

- fix(@coreui/angular): add missing peerDependencies
- refactor(sidebar-nav): IconDirective imports

---

#### `4.5.13`

- fix(multi-select): restore input focus for single select
- chore(dependencies): update

---

#### `4.5.12`

- fix(multi-select): single select - remove aggressive focus on first render regression
- perf(multi-select-option): active prop update on multiSelectFocus$ 
- fix(multi-select): tabindex on firefox for virtual-scroll-viewport
- chore(dependencies): update

---

#### `4.5.11`

- feat(multi-select): allowCreateOptions, clearSearchOnSelect props, refactor
- refactor(multi-select-option): visible prop
- fix(multi-select-optgroup): hide group without content
- fix(multi-select): undefined activeOption caused setActiveItem infinite loop
- fix(multi-select): focus management issues
- refactor(multi-select): loading as signal
- chore(dependencies): update

---

#### `4.5.10`

- refactor: @Input() transform option of @angular/core@16.1 instead of @angular/cdk coerce functions (partial)
- chore: dependencies update (angular v16.1.4)
- chore: peerDependencies update to Angular 16.1

---

#### `4.5.9`

- fix(loading-button): grow spinner is always visible for wider buttons, refactor with :enter/:leave angular animations
- chore: dependencies update

---

#### `4.5.8`

- fix(toast): show animation not working
- refactor(toast): remove: onAnimationEvent(), @fadeInOut.start, @fadeInOut.done
- fix(toaster): drop setTimeout() on removeToast()
- refactor(toaster): move to takeUntilDestroyed()
- chore: dependencies update (angular v16.1.3)

---

#### `4.5.7`

- refactor(multi-select-option): move to signals, fix performance and stability issues
- refactor(multi-select): move setSelectionModel up to constructor phase
- chore(dependencies): update

---

#### `4.5.6`

- fix(multi-select-option): NG0911: View has already been destroyed
- refactor(multi-select): signal for visibleOptions, use .some() instead of .filter()
- refactor(multi-select-option): extract isSelected() method
- chore(dependencies): update
 
---

#### `4.5.5`

- fix(multi-select): missing destroyRef
- chore(dependencies): update

---

#### `4.5.4`

- fix(filter-input.directive): missing destroyRef
- fix(multi-select-option): missing destroyRef
- feat(multi-select): loading prop
- fix(tooltip): add IntersectionObserver to remove tooltip when host element is not visible
- chore(dependencies): update

---

#### `4.5.1`

- fix(multi-select): single select reset to initial value after search and select with virtualScroller
- chore(dependencies): update

---

#### `4.4.12`

- fix(multi-select): single select reset to initial value after search and select
- chore(dependencies): update

---

#### `4.5.0`

- chore: dependencies update
  - `Angular 16`
  - `TypeScript ~4.9.3`
- refactor(breadcrumb-router.service): router.events takeUntilDestroyed()
- refactor(toaster): remove ComponentFactoryResolver

---

#### `4.4.11`

- fix(smart-table-head): reorder html for column label and sorter for use with `.text-truncate`
- chore(dependencies): update

---

#### `4.4.10`

- feat(calendar): show/select adjacent days in month view
- fix(date-range-picker): rangesButtonsSize default value & type
- fix(date-range-picker): input values update, inputEndHoverValue cleanup
- chore(peerDependencies): update `@coreui/coreui-pro` to `~4.5.0`
- chore(dependencies): update

---

#### `4.4.9`

- refactor: safe ?.unsubscribe() from subscriptions
- chore(dependencies): update

---

#### `4.4.8`

- refactor(tabs): safe tabServiceSubscription?.unsubscribe()
- chore(dependencies): update

---

#### `4.4.7`

- feat(form-check): add reverse prop
- chore(dependencies): update

---

#### `4.4.6`

- perf(calendar): skip check when no params for isDateInRangeDisabled() and isDateDisabled()
- chore(dependencies): update

---

#### `4.4.5`

- feat(smart-table): add tableCustomHeader template

---

#### `4.4.4`

- fix(multi-select): initially selected options tags not rendered
- fix(smart-table): ITableHeaderCellProps interface update
- chore(dependencies): update

---

#### `4.4.3`

- fix(calendar): disabledDates type
- fix(date-range-picker): disabled attr for input not working
- chore(dependencies): update

---

#### `4.4.1`

- fix(alert): typo in template
- refactor(html-attr): cleanup
- refactor(icon, icon-set): cleanup

---

#### `4.4.0`

- feat: standalone components
- fix(date-range-picker): infinite loop on fast input date range changes
- chore: dependencies update
- chore(sidebar): minor cleanups

---

#### `4.4.0-next.1`

- feat: standalone components
- chore: dependencies update
- fix(popover): remove popover when host element is not visible

---

#### `4.3.18`

- `@coreui/angular-pro`
  - feat(multi-select): virtualScroller
  - feat(multi-select): custom SearchFn

---

#### `4.3.17`

- `@coreui/angular`
- `@coreui/angular-chartjs`
- `@coreui/icons-angular`
  - chore: dependencies update

---

#### `4.3.16`

- `@coreui/angular-pro`
  - feat(smart-table): custom column filter functions in columns config
  - feat(smart-table): custom column sorter functions in columns config
  - chore: dependencies update
- `@coreui/angular-chartjs`
  - chore: dependencies update
- `@coreui/icons-angular`
  - feat(cIcon): standalone directive
  - chore: dependencies update

---

#### `4.3.15`

- fix(multi-select): reactive forms initial value cleared before options init
- chore: dependencies update
- `@coreui/angular-chartjs`
  - feat(c-chart): emit chartRef on new Chart()
  - feat(c-chart): standalone component

---

#### `4.3.14`

- feat(multi-select): add `search: 'external'`, `searchValueChange`, `visibleOptions`, `onTouched`, refactor
- refactor(multi-select-option): changeDetection onPush, cleanups and rewrites with rxjs
  - add `Id` prop, with default generated Id
  - add `role option`
  - `space` keydown preventDefault
  - add `exportAs: cMultiSelectOption` 
- refactor(multi-select-optgroup-label): changeDetection OnPush, cleanup
- fix(smart-table-filter): filter-input directive destroy$.complete()
- chore: dependencies update

---

#### `4.4.0-next.0`

- feat: standalone components (wip) 

---

#### `4.3.13`

- fix(multi-select): scroll for overflow-y only
 
---

#### `4.3.12`

- fix(multi-select): single select - check value against array

---

#### `4.3.11`

- fix(multi-select): single select - remove aggressive focus on first render
- fix(multi-select-option): avoid selection when dropdown not visible
- fix(offcanvas): avoid flicker on the first render

---

#### `4.3.10`

- feat(offcanvas): add responsive variations
- refactor(offcanvas): animation classes, scrollbar behavior, cleanup
- refactor(modal, offcanvas): move get scrollbarWidth to BackdropService
- feat(offcanvas): add backdrop static option support
- chore: dependencies update

---

#### `4.3.8`

- fix(dropdown): visibleChange emit and visibleState update on changes, refactor with rxjs
- feat(date-picker, date-range-picker): closeOnSelect prop to close dropdown after value setting
- refactor(multi-select-tag): multiselectVisible$ subscription with async pipe, simplified with rxjs

---

#### `4.3.7`

- fix(smart-table): add sorterValue differ
- fix(smart-table): add autocomplete off for filter inputs
- chore: update to: `Angular 15.1`

---

#### `4.3.6`

- fix(time-picker): add visual validation feedback, `valid` prop, focus/blur behavior, refactor
- fix(date-range-picker): add visual validation feedback, `valid` prop
- fix(multi-select): add visual validation feedback, `valid` prop

---

#### `4.3.5`

- fix(sidebar): open behavior on mobile layout change, refactor

---

#### `4.3.4`

- refactor(smart-table): extract table and column filter-input

---

#### `4.3.3`

- fix(sidebar): emit visible event on mobile layout change

---

#### `4.3.2`

- refactor(smart-table-filter): rewrite to observables and OnPush
- refactor(smart-table): items-per-page-selector
- fix(smart-table): tableFilterValue should update not only on firstChange
- fix(smart-table): columnSorter prop not passed to smart-table-head
- refactor(toaster): remove deprecated ComponentFactoryResolver

---

#### `4.3.1`

- fix(multi-select): selected options update fails on component value reset

---

#### `4.3.0`

update to:
- `Angular 15`
- `TypeScript 4.8`
- `RxJS 7.5`

---
