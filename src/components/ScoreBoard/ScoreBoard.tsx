import { styled } from "styled-components";

type Props = {
  score: number;
};

const ScoreBoard = ({ score }: Props) => {
  return <Container>{score}</Container>;
};

export default ScoreBoard;

const Container = styled.div``;
