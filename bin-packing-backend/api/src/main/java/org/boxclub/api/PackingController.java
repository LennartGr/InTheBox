package org.boxclub.api;

import java.util.concurrent.ThreadLocalRandom;

import org.boxclub.core.datatypes.*;
import org.boxclub.core.packing.BruteforceSolver;
import org.boxclub.core.packing.LargestAreaFitFirstSolver;
import org.boxclub.core.packing.PackingSolver;
import org.boxclub.core.sorting.DefaultPlacementComparator;
import org.boxclub.core.sorting.SortingPackingDecorator;
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
        if (USE_SORTING) solver = new SortingPackingDecorator(solver, new DefaultPlacementComparator());
        return solver.pack(request);
    }

    @PostMapping("/order-analysis")
    public OrderAnalysisResponse analyseOrders(@RequestBody OrderAnalysisRequest request) {
        // TODO code here (currently stub)
        final int min = 1;
        final int max = 4;
        
        BinRecommandation[] binRecommandations = new BinRecommandation[request.maxSizes() + 1];
        binRecommandations[0] = null;

        Integer currentId = 0;
        for (int i = 1; i < request.maxSizes() + 1; i++) {
            Bin[] binArray = new Bin[i];
            for (int j = 0; j < i; j++) {
                // i times the same bin for illustration
                int randomX = ThreadLocalRandom.current().nextInt(min, max + 1);
                int randomY = ThreadLocalRandom.current().nextInt(min, max + 1);
                int randomZ = ThreadLocalRandom.current().nextInt(min, max + 1);
                Bin testbin = new Bin((currentId++).toString(), randomX, randomY, randomZ, 1, 1, -1);
                binArray[j] = testbin;
            }

            binRecommandations[i] = new BinRecommandation(i, binArray, 0);
        }
        return new OrderAnalysisResponse(binRecommandations, true);
    }
}