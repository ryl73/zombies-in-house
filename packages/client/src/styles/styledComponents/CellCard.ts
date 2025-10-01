import styled, { css, keyframes } from 'styled-components'

const ripple = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const CellCard = styled.div<{
  $isPlayer?: boolean
  $animation?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 255, 192);
  width: 98px;
  height: 98px;
  border-radius: 20px;
  ${props =>
    props.$animation &&
    css`
      animation: ${ripple} 1s infinite ease-in-out;
    `}
  z-index: ${props => (props.$isPlayer ? '1' : '0')};
`
