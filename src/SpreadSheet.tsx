import React, { Component } from 'react';
const styles = require('./SpreadSheet.module.scss');

type State = {
  rowCount: number
  columnCount: number

  originData: {
    [id: string]: string
  }
  editingCell: string
}

const intialState: State = {
  rowCount: 10,
  columnCount: 10,

  originData: {},
  editingCell: ''
}

function getLetter(i: number): string {
  return String.fromCharCode('A'.charCodeAt(0) + i - 1)
}

const computeData: any = {}

class SpreadSheet extends Component<{}, State> {
  readonly state = intialState

  constructor(props: {}) {
    super(props)

    this.configComputeData()
  }

  configComputeData() {
    const { rowCount, columnCount } = this.state
    for (let i = 1; i <= columnCount; i++) {
      const letter = getLetter(i)
      for (let j = 1; j <= rowCount; j++) {
        const key = `${letter}${j}`
        const getter = () => {
          const value = this.state.originData[key] || ""
          if (value.charAt(0) === '=') {
            try {
              const express = value.substring(1).toUpperCase().replace(/[A-Z]\d/g, (match) => `computeData.${match}`)
              return eval(express)
            } catch (e) {
              return 'NaN'
            }
          } else {
            return isNaN(parseFloat(value)) ? value : parseFloat(value)
          }
        }
        Object.defineProperty(computeData, key, { get: getter })
      }
    }
  }

  handleFocus = (key: string) => {
    this.setState({ editingCell: key })
  }

  handleBlur = (e: any) => {
    this.setState({ editingCell: '' })
  }

  handleTextChange = (e: any, key: string) => {
    const text = e.target.value
    this.setState(prevState => ({
      ...prevState,
      originData: {
        ...prevState.originData,
        [key]: text
      }
    }))
  }

  renderHeader() {
    const { columnCount } = this.state
    const columns = []
    columns.push(<td key={'@'}></td>)
    for (let i = 1; i <= columnCount; i++) {
      const letter = getLetter(i)
      columns.push(<td key={letter}>{letter}</td>)
    }
    return <tr key={`0`}>{columns}</tr>
  }

  renderRow(rowIndex: number) {
    const { columnCount, originData, editingCell } = this.state
    const columns = []
    columns.push(<td key={`${rowIndex}`}>{rowIndex}</td>)
    for (let i = 1; i <= columnCount; i++) {
      const key = `${getLetter(i)}${rowIndex}`
      columns.push(
        <td key={key}>
          <input
            value={key === editingCell ? (originData[key] || '') : computeData[key]}
            onChange={(e) => this.handleTextChange(e, key)}
            onFocus={(e) => this.handleFocus(key)}
            onBlur={this.handleBlur} />
        </td>
      )
    }
    return <tr key={`${rowIndex}`}>{columns}</tr>
  }

  renderRows() {
    const { rowCount } = this.state
    const rows = []
    rows.push(this.renderHeader())
    for (let i = 1; i <= rowCount; i++) {
      rows.push(this.renderRow(i))
    }
    return rows
  }

  render() {
    return (
      <table>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }
}

export default SpreadSheet;
