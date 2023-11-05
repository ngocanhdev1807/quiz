import { ObjectId } from 'mongodb'

interface Quiz_Input_Type {
  _id?: ObjectId
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
  answers: string[]
  _ps: number
}

export default class Quiz {
  _id?: ObjectId
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
  answers: string[]
  _ps: number
  constructor(input: Quiz_Input_Type) {
    this._id = input._id || new ObjectId()
    this.category = input.category
    this.type = input.type
    this.difficulty = input.difficulty
    this.question = input.question
    this.correct_answer = input.correct_answer
    this.incorrect_answers = input.incorrect_answers
    this.answers = input.answers
    this._ps = input._ps
  }
}
