export interface CharacterDialogue {
    name: string;
    icon: string;
    dialogues: string[];
}

export const CHARACTERS: CharacterDialogue[] = [
    {
        name: '村民A',
        icon: '👨‍🌾',
        dialogues: [
            '「那群魔物居然趁勇者不在的時候襲擊了這裡，幸虧上天保佑，不然我也應該會是那群野獸的糧食。」',
            '「如果有一把好武器的話，我也想加入補給隊協助勇者。」',
            '「雖然正在慢慢重建了，但要恢復往日的生機仍需要點時間...」'
        ]
    },
    {
        name: '村民B',
        icon: '👨',
        dialogues: [
            '「這一定是陰謀！那名德魯伊一定是看勇者不在的時候預謀襲擊我們！」',
            '「還記得我那時逃難前，有名神秘女子相救我才得以存活，但我在那之後再也沒見過她了...」',
            '「沒想到森林的迷霧解開了!一定是有有人擊敗了那個魔物！」'
        ]
    },
    {
        name: '小孩A',
        icon: '👦',
        dialogues: [
            '「長大我也要當勇者！」'
        ]
    },
    {
        name: '神父與村民',
        icon: '👨‍💼👩👨‍👨',
        dialogues: [
            '「弟兄姐妹們！我們一起相信神吧！一起相信勇者能擊敗魔王終結末日！」',
            '「神是我們的父親！而祂會為了子女對那些野蠻的生物降下懲罰！」',
            '「歡迎捐獻給教會!教會會拿大家的善款協助重建城鎮的!」',
        ]
    },
    {
        name: '守衛老兵',
        icon: '👴',
        dialogues: [
            '「我年輕的時候也是個出色的劍士，直到我的膝蓋中了一箭...」',
            '「在野外戰鬥時千萬不能大意，隨時注意細節才是重中之重。」',
            '「魔獸入侵事件造成了很多年輕人的死亡，才會派我這不中用的老人在這當守衛。」',
            '「小心在外面的盜賊，他們可能會偽裝成受傷的冒險者。」'
        ]
    }
];

export interface MysteriousEvent {
    id: string;
    title: string;
    icon: string;
    description: string;
}

export const MYSTERIOUS_EVENTS: MysteriousEvent[] = [
    // {
    //     id: 'mysterious_altar',
    //     title: '神祕的小祭壇',
    //     icon: '🕯️',
    //     description: '你發現了一個隱蔽在小巷深處、散發著微弱光芒的古老祭壇。上面的蠟燭仍在燃燒，但此時祭壇沒有任何反應。'
    // },
    {
        id: 'strange_fountain',
        title: '廣場泉水',
        icon: '⛲',
        description: '你在這裡獲得神奇的力量，現在只是座普通的噴泉。'
    }
];
