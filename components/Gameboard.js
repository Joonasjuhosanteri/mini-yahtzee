import { View, Text, Pressable } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import StyleSheet from '../style/style'

let board = []
let dicevalues = []
let pointvalues = [1, 2, 3, 4, 5, 6]
const NBR_OF_DICES = 5
const NBR_OF_THROWS = 3
const BONUS = 63

export default function Gameboard () {
  const [nbrOfThrows, setNbrOfThrows] = useState(NBR_OF_THROWS)
  const [status, setStatus] = useState('')
  const [bonusText, setBonusText] = useState(
    `You are ${BONUS} points away from bonus`
  )
  const [selectedDices, setSelectedDices] = useState(
    new Array(NBR_OF_DICES).fill(false)
  )
  const [selectedPoints, setSelectedPoints] = useState(new Array(6).fill(false))
  const [isSelected, setIsSelected] = useState(false)
  const [points, setPoints] = useState(new Array(6).fill(0))
  const [totalPoints, setTotalPoints] = useState(0)

  const diceRow = []
  for (let i = 0; i < NBR_OF_DICES; i++) {
    diceRow.push(
      <Pressable key={'dicerow' + i} onPress={() => selectDice(i)}>
        <MaterialCommunityIcons
          name={board[i]}
          value={dicevalues[i]}
          key={'dicerow' + i}
          size={50}
          color={getDiceColor(i)}
        ></MaterialCommunityIcons>
      </Pressable>
    )
  }

  const pointsRow = []
  for (let i = 0; i < 6; i++) {
    pointsRow.push(
      <Pressable key={'pointsrow' + i} onPress={() => selectPoint(i)}>
        <Text style={{ textAlign: 'center' }}>{points[i]}</Text>
        <MaterialCommunityIcons
          name={`numeric-${i + 1}-circle`}
          key={'pointsrow' + i}
          size={50}
          color={getPointsColor(i)}
        ></MaterialCommunityIcons>
      </Pressable>
    )
  }

  useEffect(() => {
    checkBonusPoints()
    if (isGameEnd()) {
      return
    } else if (nbrOfThrows === NBR_OF_THROWS) {
      setStatus('Throw dices.')
    } else if (isSelected) {
      setNbrOfThrows(NBR_OF_THROWS)
      setIsSelected(false)
    }
  }, [nbrOfThrows, isSelected])

  function getDiceColor (i) {
    return selectedDices[i] ? 'black' : 'steelblue'
  }

  function getPointsColor (i) {
    return selectedPoints[i] ? 'black' : 'steelblue'
  }

  function isGameEnd () {
    if (selectedPoints.every((val, i, arr) => val === true)) {
      return true
    } else {
      return false
    }
  }

  function checkBonusPoints () {
    setBonusText(`You are ${BONUS - totalPoints} points away from bonus`)
    if (isGameEnd()) {
      setStatus('Game over. All points selected.')
      setSelectedDices(new Array(NBR_OF_DICES).fill(false))
      setNbrOfThrows(0)
    } else if (nbrOfThrows === 0) {
      setStatus('Select your points.')
    } else {
      setStatus('Keep throwing')
    }
    if (BONUS - totalPoints <= 0) {
      setBonusText('You got the bonus!')
    }
  }

  function throwDices () {
    if (isGameEnd()) {
      setPoints(new Array(6).fill(0))
      setSelectedPoints(new Array(6).fill(false))
      setSelectedDices(new Array(NBR_OF_DICES).fill(false))
      setTotalPoints(0)
      setNbrOfThrows(nbrOfThrows - 1)
    } else if (nbrOfThrows === 0 && !isSelected) {
      setStatus('Select your points before the next throw.')
    } else {
      for (let i = 0; i < NBR_OF_DICES; i++) {
        if (!selectedDices[i]) {
          let randomNumber = Math.floor(Math.random() * 6 + 1)
          board[i] = 'dice-' + randomNumber
          dicevalues[i] = randomNumber
        }
      }
      setNbrOfThrows(nbrOfThrows - 1)
    }
  }

  function selectDice (i) {
    if (nbrOfThrows !== NBR_OF_THROWS) {
      let dices = [...selectedDices]
      dices[i] = selectedDices[i] ? false : true
      setSelectedDices(dices)
    } else {
      setStatus('You have to throw dices first.')
    }
  }

  function selectPoint (i) {
    if (nbrOfThrows === 0 && points[i] === 0 && !isSelected) {
      let selected = [...selectedPoints]
      selected[i] = selectedPoints[i] ? false : true
      setSelectedPoints(selected)
      setIsSelected(!isSelected)
      let dicesum = 0
      for (let index = 0; index < dicevalues.length; index++) {
        if (dicevalues[index] === pointvalues[i] && selectedDices[index]) {
          dicesum += dicevalues[index]
        }
      }
      let pointsArray = [...points]
      pointsArray[i] = dicesum
      setPoints(pointsArray)
      setTotalPoints(totalPoints + pointsArray[i])
      setSelectedDices(new Array(NBR_OF_DICES).fill(false))
    } else if (points[i] !== 0) {
      setStatus('You already selected points for ' + (i + 1))
    } else {
      setStatus('Throw 3 times before setting points.')
    }
  }

  return (
    <View style={StyleSheet.gameboard}>
      <View style={StyleSheet.flex}>{diceRow}</View>
      <Text style={StyleSheet.gameinfo}>Throws left: {nbrOfThrows}</Text>
      <Text style={StyleSheet.gameinfo}>{status}</Text>
      <Pressable style={StyleSheet.button} onPress={() => throwDices()}>
        <Text style={StyleSheet.buttonText}>Throw dices</Text>
      </Pressable>
      <Text style={StyleSheet.totaltext}>Total: {totalPoints}</Text>
      <Text style={StyleSheet.bonustext}>{bonusText}</Text>
      <View style={StyleSheet.pointsrow}>{pointsRow}</View>
    </View>
  )
}