(() => {
    const randRange = (min, max) =>
          Math.floor(Math.random() * max) + min

    const canvas = document.getElementById('stage')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const stage = canvas.getContext('2d')
    , world = {width: 20, height: 20}
    , tileWidth = 20
    , tileHeight = 20
    , player = {
        x: randRange(0, world.width - 1),
        y: randRange(0, world.height - 1)
    }
    , apple = {
        x: randRange(0, world.width - 1),
        y: randRange(0, world.height - 1)
    }
    , states = {
        RUNNING: 0,
        GAMEOVER: 1
    }
    let fps = 5
    , vx = -1
    , vy = 0
    , tail = []
    , len = 3
    , score = 0
    , state = states.RUNNING
    , buttonDown = false

    for (let i = 1; i <= len; i++) {
        tail.push([(player.x + i) % world.width, player.y])
    }

    document.addEventListener('keydown', ev => {
        if (!buttonDown)
            switch (ev.key) {
            case 'w':
                if (vy != 1)
                    vy = -1
                vx = 0
                break;
            case 's':
                if (vy != -1)
                    vy = 1
                vx = 0
                break;
            case 'a':
                if (vx != 1)
                    vx = -1
                vy = 0
                break;
            case 'd':
                if (vx != -1)
                    vx = 1
                vy = 0
                break;
        }
        buttonDown = true
    })

    const update = () => {
        if (player.x === 0) player.x = world.width
        if (player.y === 0) player.y = world.width
        if (tail.length <= len)
            tail = [[player.x % world.width, player.y % world.height], ...tail]
        player.x = (player.x + vx) % world.width
        player.y = (player.y + vy) % world.height
        for (let [tx, ty] of tail) {
            if (tx === player.x && ty === player.y)
                state = states.GAMEOVER
        }
        if (tail.length - 1 === len)
            tail.pop()
        if (apple.x === player.x && apple.y === player.y) {
            score += 1
            len += 1
            apple.x = randRange(0, world.width - 1)
            apple.y = randRange(0, world.height - 1)
            if (score % 5 === 0)
                fps++
        }
        buttonDown = false
    }

    const render = () => {
        for (let i = 0; i < world.width; i++) {
            for (let j = 0; j < world.height; j++) {
                if (i === player.x && j === player.y) {
                    stage.fillStyle = 'green'
                } else { stage.fillStyle = 'black' }
                stage.fillRect(i * tileWidth,
                               j * tileHeight,
                               tileWidth,
                               tileHeight)
                stage.fillStyle = 'green'
                tail.forEach(([tx, ty]) => {
                    stage.fillRect(
                        tx * tileWidth,
                        ty * tileHeight,
                        tileWidth, tileHeight
                    )
                })
            }
        }
        stage.fillStyle = 'red'
        stage.fillRect(apple.x * tileWidth,
                       apple.y * tileHeight,
                       tileWidth, tileHeight)
        stage.fillStyle = '#fff'
        stage.font = '16px serif'
        stage.fillText('Score: ' + score,
                       10, 16)
    }

    render()
    const step = () =>
          setTimeout(() => {
              update()
              render()
              if (state === states.RUNNING) {
                  window.requestAnimationFrame(step)
              } else {
                  stage.textAlign = 'center'
                  stage.fillText('GAME OVER',
                                 world.width * tileWidth / 2,
                                 world.height * tileHeight / 2)
              }
          }, 1000 / fps)
    step()
})()
