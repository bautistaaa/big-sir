// @ts-ignore
function get_fs_obj(path) {
  let dirs = resolve_path(path);
  let destination = file_system['/'];
  for (let i = 0; i < dirs.length; i++) {
    try {
      destination = destination.content[dirs[i]];
    } catch {
      return 'File not found';
    }
  }
  return destination;
}

function get_dirs_content(paths) {
  let destinations = {};
  for (let i = 0; i < paths.length; i++) {
    let r = get_fs_obj(paths[i]);
    if (r.type !== 'directory') {
      return;
    }
    r = r.content;
    for (j in r) {
      destinations[j] = r[j];
    }
  }
  return destinations;
}

function resolve_path(short_path) {
  if (short_path === undefined || short_path === '') {
    short_path = cwd;
  }
  // These should cover all cases
  // Later var expansion could be added

  // If . is the first, replace with cwd
  // ./file
  // convert to array of names pop it and previous if element is "..", if first element is "..", just pop it
  // ../directory
  // /home/nyx/../guest
  // If "." and its in the middle of a path, just pop it
  // /bin/./cat
  // Do nothing with these
  // /home/nyx

  // if we assume cwd is "/home/nyx"
  // this makes "./file" to "/home/nyx/file"
  if (short_path.startsWith('./')) {
    short_path = cwd + short_path.substring(1, short_path.length);
  }
  if (!short_path.startsWith('/')) {
    short_path = cwd + '/' + short_path;
  }

  let path = short_path.split('/');
  path = path.filter((e) => e !== '');
  let i = 0;
  while (i < path.length) {
    let removed = false;
    if (path[i] === '.') {
      path.splice(i, 1);
      removed = true;
    }
    if (path[i] === '..') {
      if (i === 0) {
        path.splice(i, 1);
      } else {
        path.splice(i - 1, 2);
      }
      removed = true;
    }
    if (path[i] === '') {
      path.splice(i, 1);
      removed = true;
    }
    if (!removed) i++;
  }

  return path;
}

function redirect(value) {
  window.location.href = value;
}

function run_command(cmd) {
  if (cmd === '') {
    return;
  }
  [command, ...args] = cmd.split(' ');
  commands = get_dirs_content(path);
  if (
    Object.keys(commands).includes(command) &&
    commands[command].type === 'executable'
  ) {
    commands[command].content(...args);
    return;
  } else if (Object.keys(alias).includes(command)) {
    commands[alias[command]].content(...args);
    return;
  } else {
    let file = get_fs_obj(command);
    if (file !== undefined && file.type === 'file') {
      let parts = file.content.split('\n');
      if (parts.shift() === '#!/bin/nysh') {
        try {
          eval(parts.join('\n'));
          return;
        } catch (e) {
          print(e);
          return;
        }
      } else {
        text.innerText += 'file not executable\n';
        return;
      }
    } else if (file !== undefined && file.type === 'executable') {
      file.content(...args);
      return;
    } else {
      text.innerText += 'File is directory or not found\n';
    }
  }
}
