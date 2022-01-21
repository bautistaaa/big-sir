# Spotify

## TODOS
  - functional tiles on search default screen
  - utility bars on all detail pages
  - fix types on `PlaylistTable` `PlaylistTableItem` (just rewrite it all...)
  - consolidate a lot of repeated code/styles
  - link to artist pages from links in tables(playlists)
  - better error handling
  - history

## Performance Issues
    - needs virtualization on playlist table
    - use sticky instead of IntersectionObserver (redo html structure)
    - events in player dispatched alot ('player_state_changed')
      - (everytime a track is played it rerenders at least 4x when event is dispatched)

## Bugs
  - artist feed cards show pause button no matter what?
      - play button flashes (seems to disappear if you remove the image)

## UI
  - add padding to bottom search results
  - pause button misaligned on artist top tracks


