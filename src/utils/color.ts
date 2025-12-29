export const ColorText = {
    ad: (text: string | number) => `<span style="color: #FF8C00; font-weight: bold;">${text} 點物理傷害</span>`, // 橘色
    ap: (text: string | number) => `<span style="color: #9370DB; font-weight: bold;">${text} 點法術傷害</span>`, // 藍紫色
    true: (text: string | number) => `<span style="color: #FFFFFF; font-weight: bold; text-shadow: 0 0 2px #000;">${text} 點真實傷害</span>`, // 白色
    value: (text: any) => `<span style="color: #FFEB3B;">${text} 點傷害</span>` // 數值用黃色
};