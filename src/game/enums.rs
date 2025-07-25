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

pub enum Winner {
    Human,
    Ai,
    Draw,
    None,
}

pub enum GameEndCause {
    // common
    Wall,
    SelfCollision,
    Filled,

    // versus mode
    AiHitWall,
    AiHitSelf,
    AiFilled,
    HumanHitAi,
    AiHitHuman,
    HeadOnCollision,
    BothFilled,
}

impl GameEndCause {
    pub fn to_string(&self) -> &str {
        match self {
            GameEndCause::Wall => "wall",
            GameEndCause::SelfCollision => "self",
            GameEndCause::Filled => "filled",
            GameEndCause::AiHitWall => "aiHitWall",
            GameEndCause::AiHitSelf => "aiHitSelf",
            GameEndCause::AiFilled => "aiFilled",
            GameEndCause::HumanHitAi => "humanHitAi",
            GameEndCause::AiHitHuman => "aiHitHuman",
            GameEndCause::HeadOnCollision => "headOnCollision",
            GameEndCause::BothFilled => "bothFilled",
        }
    }
}
