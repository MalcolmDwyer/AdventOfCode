import fs from 'fs'
import fetch from 'node-fetch';

export const readFile = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

export const getLines = input => {
  return input
    .split('\n')
    .filter(line => line)
}

export const lineReader = async (path = './input.txt') => {
  const file = await readFile(path)
  return file
    .split('\n')
    .filter(line => line)
}

export const gridReader = async (path = './input.txt') => {
  const file = await readFile(path)
  return file
    .split('\n')
    .filter(line => line)
    .split('')
}