#[derive(Debug)]
pub enum Collision {
    Wall,
    OwnBody,
    Food,
    HumanHeadToAiHead, // Human moved into AI's cell
    AiHeadToHumanHead, // AI moved into human's cell
    HeadSwap,
    HumanHeadToAiBody,
    AiHeadToHumanBody,
}
