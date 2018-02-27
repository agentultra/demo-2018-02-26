const canvas = document.getElementById('stage')
, stage = canvas.getContext('2d')
, stageW = 640 // 40 tiles
, stageH = 400 // 25 tiles
, buttons = {
    Up: 0,
    Down: 0,
    Left: 0,
    Right: 0
}
, tileW = 16
, tiles = {
    EMPTY: {img: 'lightgrey', passable: true},
    WALL: {img: 'darkgrey', passable: false}
}

canvas.width = stageW
canvas.height = stageH

const always = x => () => x
const btn = name => buttons.hasOwnProperty(name) && buttons[name]
const range = (n, v=0) => Array.from({length: n}, always(v))

const state = {
    player: {
        x: 1, y: 1,
        dx: 0, dy: 0,
        worldPos: {
            x: 0, y: 0
        }
    }
}

const setPlayerWorldPos = (x, y) => {
    const {player} = state
    Object.assign(player, {
        worldPos: {x, y}
    })
}

const TileMap = (width, height, tile=tiles.EMPTY) => ({
    width, height,
    tiles: range(width * height, tile)
})

const getTile = (tileMap, x, y) => {
    return tileMap.tiles[y * tileMap.width + x]
}

const setTile = (tileMap, x, y, tile) => {
    tileMap.tiles[y * tileMap.width + x] = tile
}

const setCurrentMap = tileMap => Object.assign(state, {tileMap})

const map1 = TileMap(40, 25)
const map2 = TileMap(40, 25)

const clr = () => {
    stage.fillStyle = 'black'
    stage.fillRect(0, 0, stageW, stageH)
}

const init = () => {
    let t = map1
    for (let y = 0; y < t.height; y++) {
        setTile(t, 0, y, tiles.WALL)
        setTile(t, t.width - 1, y, tiles.WALL)
        for (let x = 0; x < t.width; x++) {
            setTile(t, x, 0, tiles.WALL)
            setTile(t, x, t.height - 1, tiles.WALL)
        }
    }
    setTile(t, 19, 0, tiles.EMPTY)
    setTile(t, 20, 0, tiles.EMPTY)
    setTile(t, 21, 0, tiles.EMPTY)
    setCurrentMap(t)

    t = map2
    for (let y = 0; y < t.height; y++) {
        setTile(t, 0, y, tiles.WALL)
        setTile(t, t.width - 1, y, tiles.WALL)
        for (let x = 0; x < t.width; x++) {
            setTile(t, x, 0, tiles.WALL)
            setTile(t, x, t.height - 1, tiles.WALL)
        }
    }
    setTile(t, 19, t.height - 1, tiles.EMPTY)
    setTile(t, 20, t.height - 1, tiles.EMPTY)
    setTile(t, 21, t.height - 1, tiles.EMPTY)
    setTile(t, 19, 13, tiles.WALL)
    setTile(t, 19, 14, tiles.WALL)
    setTile(t, 19, 15, tiles.WALL)
    setTile(t, 21, 13, tiles.WALL)
    setTile(t, 21, 14, tiles.WALL)
    setTile(t, 21, 15, tiles.WALL)

    state.worldMap = {
        '0,0': map1,
        '0,-1': map2
    }
}

const getTileMap = (x, y) => {
    const {worldMap} = state
    return worldMap[`${x},${y}`]
}

const moveWorld = (dx, dy) => {
    const {player} = state
    , {worldPos: p} = player
    , next = {x: p.x + dx, y: p.y + dy}

    const m = getTileMap(next.x, next.y)
    if (m) {
        setPlayerWorldPos(next.x, next.y)
        setCurrentMap(m)
    } else {
        return;
    }
    if (dy < 0 && dx === 0) {
        state.player.y = m.height - 1
    } else if (dy > 0 && dx === 0) {
        state.player.y = 0
    } else if (dy === 0 && dx < 0) {
        state.player.x = m.width - 1
    } else if (dy === 0 && dx > 0) {
        state.player.x = 0
    }
}

const move = (obj, dx, dy) => {
    const {tileMap} = state
    , next = Object.assign({}, {
        x: obj.x + dx,
        y: obj.y + dy
    })
    , t = getTile(tileMap, next.x, next.y)
    if (next.y < 0) {
        moveWorld(0, -1)
        return;
    } else if (next.y === tileMap.height) {
        moveWorld(0, 1)
        return;
    } else if (next.x < 0) {
        moveWorld(-1, 0)
        return;
    } else if (next.x === tileMap.width) {
        moveWorld(1, 0)
        return;
    }
    if (t.passable) {
        Object.assign(obj, next)
    }
}

const update = dt => {}

const updateSimulation = () => {}

const drawPlayer = () => {
    const {player: p} = state
    stage.fillStyle = 'yellow'
    stage.fillRect(p.x * tileW, p.y * tileW, tileW, tileW)
}

const drawTileMap = () => {
    const {tileMap: map} = state
    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            const t = getTile(map, x, y)
            stage.fillStyle = t.img
            stage.fillRect(x * tileW, y * tileW, tileW, tileW)
        }
    }
}

const render = () => {
    clr()
    drawTileMap()
    drawPlayer()
}

const loop = dt => {
    update(dt)
    render()
    window.requestAnimationFrame(loop)
}

init()
window.requestAnimationFrame(loop)

document.addEventListener('keydown', ev => {
    if (ev.key === 'k') {
        move(state.player, 0, -1)
    } else if (ev.key === 'j') {
        move(state.player, 0, 1)
    } else if (ev.key === 'h') {
        move(state.player, -1, 0)
    } else if (ev.key === 'l') {
        move(state.player, 1, 0)
    } else if (ev.key === 'y') {
        move(state.player, -1, -1)
    }
    else if (ev.key === 'u') {
        move(state.player, 1, -1)
    }
    else if (ev.key === 'n') {
        move(state.player, -1, 1)
    }
    else if (ev.key === 'm') {
        move(state.player, 1, 1)
    }
    updateSimulation()
})
