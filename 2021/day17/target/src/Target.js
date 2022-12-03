import React, { useState, useMemo, useCallback } from 'react';
import './Target.scss';

const Target = () => {

  const [x, setX] = useState(7);
  const [y, setY] = useState(2);

  // x=20..30, y=-10..-5
  // target area: x=281..311, y=-74..-54

  // const targetX = [20, 30];
  // const targetY = [-10, -5];
  // const minX = -10;
  // const maxX = Math.floor(targetX[1] * 1.2);
  // const minY = Math.floor(targetY[1] * 1.5);
  // const maxY = Math.floor(60);

  const targetX = [281, 311];
  const targetY = [-74, -54];

  const minX = -10;
  const maxX = Math.floor(targetX[1] * 1.2);
  const minY = -100;
  const maxY = 200;

  console.log(`Y: ${maxY} - ${minY} => ${maxY - minY}`)
  console.log(`X: ${maxX} - ${minX} => ${maxX - minX}`)

  const positions = useMemo(() => {
    let p = [];

    let px = 0;
    let py = 0;
    let mx = x;
    let my = y;
    for (let n = 0; n < 180; n++) {
      px += mx;
      py += my;
      p.push([px, py]);
      if (mx > 0) {
        mx--;
      }
      else if (mx < 0) {
        mx++;
      }
      my--;
    }
    console.log('p', p);

    return p;
  }, [x, y]);

  const top = useMemo(() => {
    let t = -Infinity;
    positions.forEach(([x, y]) => {
      if (y > t) {
        t = y;
      }
    });
    return t;
  }, [positions]);

  const getCellProps = useCallback((x, y) => {
    let className = '';
    if (
      x >= targetX[0]
      && x <= targetX[1]
      && y >= targetY[0]
      && y <= targetY[1]
    ) {
      className += ' target-area';
    }

    if (x === 0 && y === 0) {
      className += ' start';
    }

    if (positions?.find(([px, py]) => (
      x === px && y === py
    ))) {
      className += ' arc';
    }

    return ({
      className,
      'data-x': x,
      'data-y': y,
    })
  }, [positions]);

  const onChangeX = (ev) => {
    setX(parseInt(ev?.target?.value));
  };
  const onChangeY = (ev) => {
    setY(parseInt(ev?.target?.value));
  };

  return (
    <div>
      <div>
        <input value={x} type="number" onChange={onChangeX} placeholder="x"/>
        <input value={y} type="number" onChange={onChangeY} placeholder="y"/>
        <span>{`TOP: ${top}`}</span>
      </div>
      <table className="target-graph" cellSpacing={0}>
        <tbody>
          {Array(maxY - minY).fill(null).map((n, iy) => (
            <tr key={iy} data-y={maxY - iy + minY}>
              {Array(maxX - minX).fill(null).map((m, ix) => (
                <td key={`${iy}_${ix}`} {...getCellProps(ix + minX, maxY - iy + minY)} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )


};

export default Target;

// 24, 73