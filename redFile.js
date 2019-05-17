const fs = require('fs')
const Graph = require('node-dijkstra')

const parseFile = fileName => {
  const data = fs.readFileSync(fileName)

  const dataArr = data
    .toString()
    .split('\n')

  const [_, N, M, C, R] = /(\d+) (\d+) (\d+) (\d+)/.exec(dataArr[0])
  
  const customers = dataArr
    .slice(1, Number(C)+1)
    .map(str => 
      /(\d+) (\d+) (\d+)/.exec(str)
        .slice(1)
        .map(str => Number(str))
    )
    .map(([x, y, reward]) => ({x, y, reward}))

  const matriz = dataArr
    .slice(Number(C)+1)

  const infinity = Math.infinity
  const getCusto = char => 
      char === '#' ? 9999999999 : 
      char === '~' ? 800 : 
      char === '*' ? 200 : 
      char === '+' ? 150 : 
      char === 'X' ? 120 : 
      char === '_' ? 100 : 
      char === 'H' ? 70 : 
      char === 'T' ? 50 : 
      0

  const grafo = new Graph()
  
  matriz
    .map((row, y) => row
      .split('')
      .filter(char => char !== '\r')
      .map((char, x) => {
        
        const caminhos = Object.assign(
          x !== 0 ? { [`${x-1} ${y}`]: getCusto(char) } : {},
          y !== 0 ? { [`${x} ${y-1}`]: getCusto(char) } : {},
          x !== N-1 ? { [`${x+1} ${y}`]: getCusto(char) } : {},
          y !== M-1 ? { [`${x} ${y+1}`]: getCusto(char) } : {},
        )
        grafo.addNode(`${x} ${y}`, caminhos)
        
        return char
      })
    )
  return {
    grafo,
    customers
  }
}

const { grafo, customers } = parseFile('./1_victoria_lake.txt')

const customersGraph = new Graph()
customers.map(({x, y, reward}) => {
  customersGraph.addNode(`${x} ${y}`, customers.reduce(
    (acc, { x, y, reward }) => ({ ...acc, [`${x} ${y}`]: reward }), {}
  ))

  console.log(customersGraph)
})