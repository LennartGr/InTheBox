package org.boxclub.core.datatypes;

public record OrderAnalysisResponse(BinRecommandation[] binRecommandations, MarketBinRecommandation[] marketBinRecommandations, boolean success) {
    
}
