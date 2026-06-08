'use client';

import { useEffect, useReducer } from 'react';

const WORD        = 'COMMING SOON';
const TYPE_SPEED  = 100;
const DEL_SPEED   = 60;
const PAUSE_FULL  = 2000;
const PAUSE_EMPTY = 500;

type Phase = 'typing' | 'pausing' | 'deleting' | 'waiting';

interface State {
  displayed: string;
  phase: Phase;
}

type Action =
  | { type: 'TYPE' }
  | { type: 'DONE_TYPING' }
  | { type: 'START_DELETING' }
  | { type: 'DELETE' }
  | { type: 'DONE_DELETING' }
  | { type: 'START_TYPING' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TYPE':
      return { ...state, displayed: WORD.slice(0, state.displayed.length + 1) };
    case 'DONE_TYPING':
      return { ...state, phase: 'pausing' };
    case 'START_DELETING':
      return { ...state, phase: 'deleting' };
    case 'DELETE':
      return { ...state, displayed: state.displayed.slice(0, -1) };
    case 'DONE_DELETING':
      return { ...state, phase: 'waiting' };
    case 'START_TYPING':
      return { ...state, phase: 'typing' };
    default:
      return state;
  }
}

const initialState: State = { displayed: '', phase: 'typing' };

export default function HeroTypewriter() {
  const [{ displayed, phase }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (phase === 'typing') {
      if (displayed.length < WORD.length) {
        const t = setTimeout(() => dispatch({ type: 'TYPE' }), TYPE_SPEED);
        return () => clearTimeout(t);
      }
      dispatch({ type: 'DONE_TYPING' });
    } else if (phase === 'pausing') {
      const t = setTimeout(() => dispatch({ type: 'START_DELETING' }), PAUSE_FULL);
      return () => clearTimeout(t);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => dispatch({ type: 'DELETE' }), DEL_SPEED);
        return () => clearTimeout(t);
      }
      dispatch({ type: 'DONE_DELETING' });
    } else if (phase === 'waiting') {
      const t = setTimeout(() => dispatch({ type: 'START_TYPING' }), PAUSE_EMPTY);
      return () => clearTimeout(t);
    }
  }, [displayed, phase]);

  return (
    <span className="hero-typewriter">
      {displayed}
      <span className="hero-cursor" aria-hidden="true">|</span>
    </span>
  );
}
