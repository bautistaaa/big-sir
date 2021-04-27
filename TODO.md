=============================
www.big-sir.com
=============================
BUGS
=============================
- clicking on iframe doesnt switch windows
- When the active terminal line is at the bottom of the screen... typing a multiline will overflow under the window.
=============================
TODO
=============================
- tabs in chrome
- open up chrome when opening html file
- looking into previous, forward, refresh commands on chrome
- clicking dock icon of active app should open it back up
- Refactor WINDOW
  - redo minimize logic
- enable ../../ navigation
- tie filesystem to finder
- setup animations when you toggle things in the command panel
=============================
Priority
- Top Bar Menu Items ( About This Mac / Settings );
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
- Neovim ( navigation (ctrl e/y/u/d/f) ) ** DONE **
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
- cd with no arg breaks ** DONE **
- All windows (terminal, chrome, about) all open with scrollbars enabled. ** DONE **
- When someone does do a multiline command, for whatever reason, shouldn't the [/]$ should be top aligned ** DONE **
- scrollbars when maximizing a window ** DONE **
- opening resume in vim CATS the file as well ** DONE **
- Pressing up in the terminal puts the cursor at the beginning of the line instead of the end of the line ** DONE **
- Typing in a domain name requires the protocol or we get big-sir inception. i.e. vin-e.com will get you big-sir where as https://vin-e.com/ opens the page ** DONE **
- If you open html with chrome already opened, NOTHING happens ** DONE **

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

