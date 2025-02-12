const U_VALUES = {
    brickWall1800: 1.8,
    brickWall1600: 1.4,
    brickWall1200: 0.8,
    reinforcedConcrete: 1.7,
    lightweightConcrete1800: 0.8,
    lightweightConcrete500: 0.14,

    concreteFloor: 1.4,
    woodenFloorPine: 0.13,
    woodenFloorOak: 0.1,
    insulatedConcreteFloor: 0.39
};

function calculateHeatLoss(area, deltaT, uValue) {
    return area * deltaT * uValue;
}

function calculateHeatingPower({
    area,
    height,
    windowArea,
    windowLayers,
    outsideTemp,
    insideTemp,
    wallArea,
    wallType,
    floorArea,
    floorType,
    safetyFactor = 1.2
}) {
    const volume = area * height;
    const deltaT = insideTemp - outsideTemp;

    let glazingU;
    switch (windowLayers) {
        case '1':
            glazingU = 2.8;
            break;
        case '2':
            glazingU = 1.1;
            break;
        case '3':
            glazingU = 0.6;
            break;
        default:
            throw new Error('Invalid glazing type');
    }

    const wallU = U_VALUES[wallType];
    if (!wallU) {
        throw new Error('Invalid wall type');
    }

    const floorU = U_VALUES[floorType];
    if (!floorU) {
        throw new Error('Invalid floor type');
    }

    const windowHeatLoss = calculateHeatLoss(windowArea, deltaT, glazingU);
    const wallHeatLoss = calculateHeatLoss(wallArea, deltaT, wallU);
    const floorHeatLoss = calculateHeatLoss(floorArea, deltaT, floorU);

    const totalHeatLoss = windowHeatLoss + wallHeatLoss + floorHeatLoss;

    const requiredPower = totalHeatLoss * safetyFactor;

    return requiredPower;
}

document.getElementById('calculateButton').addEventListener('click', () => {
    const area = parseFloat(document.getElementById('area').value);
    const height = parseFloat(document.getElementById('height').value);
    const windowArea = parseFloat(document.getElementById('windowArea').value);
    const windowLayers = document.getElementById('windowLayers').value;
    const outsideTemp = parseFloat(document.getElementById('outsideTemp').value);
    const insideTemp = parseFloat(document.getElementById('insideTemp').value);
    const wallType = document.getElementById('wallType').value;
    const wallsCount = parseInt(document.getElementById('wallsCount').value, 10);
    const floorType = document.getElementById('floorType').value;

    if (
        isNaN(area) || isNaN(height) || isNaN(windowArea) || isNaN(outsideTemp) ||
        isNaN(insideTemp) || isNaN(wallsCount)
    ) {
        alert('Please fill out all fields correctly.');
        return;
    }

    const wallArea = wallsCount * height * (area / 4);
    const floorArea = area;

    const power = calculateHeatingPower({
        area,
        height,
        windowArea,
        windowLayers,
        outsideTemp,
        insideTemp,
        wallArea,
        wallType,
        floorArea,
        floorType
    });

    document.getElementById('powerOutput').textContent = power.toFixed(2);
});
