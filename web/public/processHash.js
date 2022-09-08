const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)

const hash = urlParams.get('hash')

if (!hash) {
    alert('No hash provided!')
    window.location.href = '/'
}

const hashSplit = hash.match(/.{1,6}/g)
const iterations = parseInt(hashSplit[hashSplit.length - 1])

const canvas = document.getElementById('hashProcessingCanvas')
const context = canvas.getContext('2d')

console.log(iterations)

;(async () => {
    let currentHash = hash
    for (let it = 0; it < iterations; it ++) {
        let hash = sha512(currentHash)
        fillWithHash(currentHash, context)
        currentHash = await sha512(currentHash)
        await new Promise((resolve) => setTimeout(resolve, 50))
    }
    console.log(`Done ${iterations} iterations !`)
})()

/**
 *
 * @param {string} hash
 * @param {CanvasRenderingContext2D} canvasContext
 */
function fillWithHash(hash, canvasContext) {
    const hashSplit = hash.match(/.{1,6}/g)
    const colors = hashSplit.slice(0, - 1).map((color) => `#${color}`)
    /** @type {int[]} */
    const xCoords = hashSplit.slice(0, - 1).map((hex) => parseInt(hex.slice(0, 2), 16) + parseInt(hex.slice(2, 4), 16) + parseInt(hex.slice(4, 6), 16))

    for (let i = 0; i < 210; i += 10) {
        context.fillStyle = colors[i / 10]
        // We use the color at index i / 10
        // We use the x coordinate at index i / 10 REVERSED (first color with last xCoord)
        context.fillRect(xCoords[xCoords.length - (i / 10) - 1], i, 10, 10)
    }
}

async function sha512(string) {
    // GET to /hash with query param toHash
    return (await fetch(`/hash?toHash=${encodeURIComponent(string)}`)).text()
}
