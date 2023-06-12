package org.boxclub.core.datatypes;

// decorates bin recommandation
public record MarketBinRecommandation(BinRecommandation binRecommandation, Double[] prices, String[] offererNames) {

}
