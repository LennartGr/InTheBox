package org.boxclub.api;

import java.util.concurrent.ThreadLocalRandom;

import org.boxclub.core.datatypes.*;
import org.boxclub.core.packing.BruteforceSolver;
import org.boxclub.core.packing.LargestAreaFitFirstSolver;
import org.boxclub.core.packing.PackingSolver;
import org.boxclub.core.sorting.DefaultPlacementComparator;
import org.boxclub.core.sorting.SortingPackingDecorator;
import org.eclipse.collections.api.bag.primitive.DoubleBag;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
// the local host port we are communicating with (the one of the visualisation)
@CrossOrigin(origins = "http://localhost:3000")
public class PackingController {
    private PackingSolver solver = new LargestAreaFitFirstSolver();
    private static final boolean USE_SORTING = true;

    @PostMapping("/pack")
    public PackingResponse pack(@RequestBody PackingRequest request) {
        switch (request.algorithm()) {
            case LARGEST_AREA_FIT_FIRST -> solver = new LargestAreaFitFirstSolver();
            case BRUTEFORCE -> solver = new BruteforceSolver();
        }
        if (USE_SORTING)
            solver = new SortingPackingDecorator(solver, new DefaultPlacementComparator());
        return solver.pack(request);
    }

    @PostMapping("/order-analysis")
    public OrderAnalysisResponse analyseOrders(@RequestBody OrderAnalysisRequest request) {
        // TODO code here (currently stub)
        

        BinRecommandation[] binRecommandations = new BinRecommandation[request.maxSizes() + 1];
        MarketBinRecommandation[] marketBinRecommandations = new MarketBinRecommandation[request.maxSizes() + 1];
        binRecommandations[0] = null;
        marketBinRecommandations[0] = null;

        Integer currentId = 0;
        for (int i = 1; i < request.maxSizes() + 1; i++) {

            // create single recommandation (market or not)
            Bin[] binArray = new Bin[i];
            Bin[] marketBinArray = new Bin[i];

            for (int j = 0; j < i; j++) {
                // bin with random dimensions for illustration
                Bin randomBin = createRandomBin(currentId++);
                binArray[j] = randomBin;

                // prototype: create market bin recommandation with sizes a little bigger
                marketBinArray[j] = inflateBinRandomly(randomBin);
            }

            binRecommandations[i] = new BinRecommandation(i, binArray, 0.8);
            marketBinRecommandations[i] = new MarketBinRecommandation(new BinRecommandation(i, marketBinArray, 0.6), getRandomPriceArray(i), getRandomOffererArray(i));

            // prepare market bin recommandation

        }
        return new OrderAnalysisResponse(binRecommandations, marketBinRecommandations, true);
    }

    private Bin createRandomBin(int id) {
        final int min = 1;
        final int max = 4;

        int randomX = ThreadLocalRandom.current().nextInt(min, max + 1);
        int randomY = ThreadLocalRandom.current().nextInt(min, max + 1);
        int randomZ = ThreadLocalRandom.current().nextInt(min, max + 1);
        return new Bin(String.valueOf(id), randomX, randomY, randomZ, 1, 1, -1);
    }

    // make a given bin slightly bigger
    private Bin inflateBinRandomly(Bin bin) {
        final int min = 1;
        final int max = 10;

        int randomX = ThreadLocalRandom.current().nextInt(min, max + 1) / max;
        int randomY = ThreadLocalRandom.current().nextInt(min, max + 1) / max;
        int randomZ = ThreadLocalRandom.current().nextInt(min, max + 1) / max;

        return new Bin(bin.id(), bin.x() + randomX, bin.y() + randomY, bin.z() + randomZ, bin.maxWeight(), bin.emptyWeight(), bin.count());
    }

    private String[] getRandomOffererArray(int length) {
        String[] arr = new String[length];
        // skip first because null
        for (int i = 0; i < length; i++) {
            arr[i] = getRandomOfferer();
        }
        return arr;
    }

    private String getRandomOfferer() {
        final String[] offerers = {"Brand A", "Brand B", "Brand C"};
        int randomIndex = ThreadLocalRandom.current().nextInt(0, offerers.length);
        return offerers[randomIndex];
    }

    private Double[] getRandomPriceArray(int length) {
        Double[] arr = new Double[length];
        for (int i = 0; i < length; i++) {
            arr[i] = getRandomPrice();
        }
        return arr;
    }

    private double getRandomPrice() {
        return ThreadLocalRandom.current().nextInt(10, 50 + 1) / 10;
    }
}