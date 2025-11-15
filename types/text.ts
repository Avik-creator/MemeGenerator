export interface Meme {
    id: string;
    name: string;
    url: string;
    width: number;
    height: number;
    box_count: number;
}

export interface text {
    // Top Text Properties
    topText: string;
    topTextColor: string;
    topStrokeColor: string;
    topStrokeWidth: number;
    topTextFontSize: string;
    topPosXPercent: number;
    topPosYPercent: number;
    topTextOpacity: number;
    topLetterSpacing: number;
    // Bottom Text Properties
    bottomText: string;
    bottomTextColor: string;
    bottomStrokeColor: string;
    bottomStrokeWidth: number;
    bottomTextFontSize: string;
    bottomPosXPercent: number;
    bottomPosYPercent: number;
    bottomTextOpacity: number;
    bottomLetterSpacing: number;
}

