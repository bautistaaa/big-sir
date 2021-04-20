=============================
www.big-sir.com
=============================
BUGS
=============================
- cd with no arg breaks
- commands in general with no args act weird
=============================
TODO
=============================
- Refactor WINDOW
  - redo minimize logic
- fix cd command for files
- enable ../../ navigation
- tie filesystem to finder
- setup animations when you toggle things in the command panel
=============================
Priority
- Top Bar Menu Items ( About This Mac / Settings );
- Neovim ( navigation (ctrl e/y/u/d/f) )
=============================
Secondary
=============================
 - Spotify
 - Chrome
=============================
Dead last
=============================
- persist file changes via local storage
=============================
DONE
=============================
- when you change directories we do not want to change dir display on previous ran commmands ** DONE **
- fix typo in usePromptState(file name is wrong) ** DONE**
- fix finder styles, create svgs in Figma ** DONE **
- autocomplete needs to actually update the ref ** DONE **

- when you enter vim it takes you back to the root directory ** DONE **
- / should take you to root ** DONE **
- pwd command ** DONE **
- show file not found for vim/cat/anything ** DONE ** REFACTOR CODE LATER
- strip `/` from path parts ** DONE **
- fix auto complete for cat/nvim ** DONE **
- fix cat nvim command when in same directory ** DONE **

=============================
FEEDBACK
=============================
WINDOW (pass name, resolve state itself)
	- Define stoplight variant as a prop.
VARIANTS via SWITCH
	- None (idk but probably exists)
	- Inline Compact (VSCode / Discord)
	- Inline (Finder)
	- Standard (Terminal)

