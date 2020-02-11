export interface VisualizationValue {
    Type: "FloatValueVisualization" | "ScreenContentVisualization",
    VisualizationElement: string,

    // float visualization specific parameters ( for lights )
    Value: number,

    // Screen specific parameters
    FileName?: string               // This parameter is optional since it will be generated on export
    File?: File                     // This parameter will be used instead of FileName during runtime
}