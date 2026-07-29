import { world, EquipmentSlot } from "@minecraft/server";


const MODOS = [
    { id: "veia", nome: "Veia", tipo: "veia" },
    { id: "tunel_1x1", nome: "Túnel 1x1", tipo: "tunel", tamanho: 1 },
    { id: "tunel_2x2", nome: "Túnel 2x2", tipo: "tunel", tamanho: 2 },
    { id: "tunel_3x3", nome: "Túnel 3x3", tipo: "tunel", tamanho: 3 },
    { id: "escada_1x1", nome: "Escada 1x1", tipo: "escada", tamanho: 1 },
    { id: "escada_2x2", nome: "Escada 2x2", tipo: "escada", tamanho: 2 },
    { id: "escada_3x3", nome: "Escada 3x3", tipo: "escada", tamanho: 3 }
];


function quebrarTunel(startLocation, dimension, player, tamanho) {
    const MAX_BLOCKS = 64; 
    let brokenCount = 0;

    const viewDir = player.getViewDirection();
    const absX = Math.abs(viewDir.x);
    const absY = Math.abs(viewDir.y);
    const absZ = Math.abs(viewDir.z);

    let stepX = 0, stepY = 0, stepZ = 0;
    let isXAxis = false, isYAxis = false, isZAxis = false;

    if (absX > absY && absX > absZ) {
        stepX = viewDir.x > 0 ? 1 : -1; 
        isXAxis = true;
    } else if (absY > absX && absY > absZ) {
        stepY = viewDir.y > 0 ? 1 : -1; 
        isYAxis = true;
    } else {
        stepZ = viewDir.z > 0 ? 1 : -1; 
        isZAxis = true;
    }

    const PROFUNDIDADE = Math.floor(MAX_BLOCKS / (tamanho * tamanho));

    const min = (tamanho === 3) ? -1 : 0;
    const max = (tamanho === 1) ? 0 : 1;

    for (let d = 0; d < PROFUNDIDADE; d++) {
        let centroX = startLocation.x + (stepX * d);
        let centroY = startLocation.y + (stepY * d);
        let centroZ = startLocation.z + (stepZ * d);

        for (let a = min; a <= max; a++) {
            for (let b = min; b <= max; b++) {
                
                let targetX = centroX;
                let targetY = centroY;
                let targetZ = centroZ;

                if (isXAxis) { targetY += a; targetZ += b; } 
                else if (isYAxis) { targetX += a; targetZ += b; } 
                else if (isZAxis) { targetX += a; targetY += b; }

                try {
                    let blocoAlvo = dimension.getBlock({ x: targetX, y: targetY, z: targetZ });
                    if (blocoAlvo) {
                        const id = blocoAlvo.typeId;
                        if (id !== "minecraft:air" && id !== "minecraft:bedrock" && !id.includes("water") && !id.includes("lava")) {
                            dimension.runCommandAsync(`setblock ${targetX} ${targetY} ${targetZ} air destroy`);
                            brokenCount++;
                            if (brokenCount >= MAX_BLOCKS) return brokenCount;
                        }
                    }
                } catch (e) {}
            }
        }
    }
    return brokenCount;
}

function quebrarEscada(startLocation, dimension, player, tamanho) {
    const MAX_BLOCKS = 64; 
    let brokenCount = 0;

    const viewDir = player.getViewDirection();
    const absX = Math.abs(viewDir.x);
    const absZ = Math.abs(viewDir.z);

    let stepX = 0, stepZ = 0;
    let isXAxis = false;

    if (absX > absZ) {
        stepX = viewDir.x > 0 ? 1 : -1;
        isXAxis = true;
    } else {
        stepZ = viewDir.z > 0 ? 1 : -1;
    }

    let stepY = viewDir.y < 0 ? -1 : 1;
    const PROFUNDIDADE = Math.floor(MAX_BLOCKS / (tamanho * tamanho));

    const min = (tamanho === 3) ? -1 : 0;
    const max = (tamanho === 1) ? 0 : 1;

    for (let d = 0; d < PROFUNDIDADE; d++) {
        let centroX = startLocation.x + (stepX * d);
        let centroY = startLocation.y + (stepY * d);
        let centroZ = startLocation.z + (stepZ * d);

        for (let a = min; a <= max; a++) {
            for (let b = min; b <= max; b++) {
                
                let targetX = centroX;
                let targetY = centroY + a; 
                let targetZ = centroZ;

                if (isXAxis) targetZ += b;
                else targetX += b;

                try {
                    let blocoAlvo = dimension.getBlock({ x: targetX, y: targetY, z: targetZ });
                    if (blocoAlvo) {
                        const id = blocoAlvo.typeId;
                        if (id !== "minecraft:air" && id !== "minecraft:bedrock" && !id.includes("water") && !id.includes("lava")) {
                            dimension.runCommandAsync(`setblock ${targetX} ${targetY} ${targetZ} air destroy`);
                            brokenCount++;
                            if (brokenCount >= MAX_BLOCKS) return brokenCount;
                        }
                    }
                } catch (e) {}
            }
        }
    }
    return brokenCount;
}

function quebrarVeia(startLocation, blockId, dimension) {
    if (!blockId.includes("log") && !blockId.includes("ore")) return 0;

    const MAX_BLOCKS = 64; 
    let blocksToSearch = [startLocation];
    let visited = new Set();
    visited.add(`${startLocation.x},${startLocation.y},${startLocation.z}`);
    let brokenCount = 0;

    const baseBlockId = blockId.replace("lit_", "");

    while (blocksToSearch.length > 0 && brokenCount < MAX_BLOCKS) {
        let currentLoc = blocksToSearch.shift();

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                    if (dx === 0 && dy === 0 && dz === 0) continue;

                    let nx = currentLoc.x + dx;
                    let ny = currentLoc.y + dy;
                    let nz = currentLoc.z + dz;
                    let posKey = `${nx},${ny},${nz}`;

                    if (!visited.has(posKey)) {
                        visited.add(posKey);
                        try {
                            let neighborBlock = dimension.getBlock({ x: nx, y: ny, z: nz });
                            if (neighborBlock) {
                                const baseNeighborId = neighborBlock.typeId.replace("lit_", "");
                                if (baseNeighborId === baseBlockId) {
                                    blocksToSearch.push({ x: nx, y: ny, z: nz });
                                    dimension.runCommandAsync(`setblock ${nx} ${ny} ${nz} air destroy`);
                                    brokenCount++;
                                    if (brokenCount >= MAX_BLOCKS) return brokenCount;
                                }
                            }
                        } catch (e) {}
                    }
                }
            }
        }
    }
    return brokenCount; 
}

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const { block, brokenBlockPermutation, player } = event;
    const blockId = brokenBlockPermutation.type.id;
    const dimension = block.dimension;

    if (!player.isSneaking) return;

    let modoAtivo = MODOS[0]; 
    for (let modo of MODOS) {
        if (player.hasTag("modo_" + modo.id)) {
            modoAtivo = modo;
            break;
        }
    }

    let blocosQuebradosCausados = 0;

    if (modoAtivo.tipo === "tunel") {
        blocosQuebradosCausados = quebrarTunel(block.location, dimension, player, modoAtivo.tamanho);
    } else if (modoAtivo.tipo === "escada") {
        blocosQuebradosCausados = quebrarEscada(block.location, dimension, player, modoAtivo.tamanho);
    } else {
        blocosQuebradosCausados = quebrarVeia(block.location, blockId, dimension);
    }
    if (blocosQuebradosCausados > 0) {
        const equipComponent = player.getComponent("minecraft:equippable");
        if (!equipComponent) return; 

        const ferramenta = equipComponent.getEquipment(EquipmentSlot.Mainhand);

        if (ferramenta) {
            const durabilidade = ferramenta.getComponent("minecraft:durability");
            if (durabilidade) {
                const novoDano = durabilidade.damage + blocosQuebradosCausados;

                if (novoDano >= durabilidade.maxDurability) {
                    equipComponent.setEquipment(EquipmentSlot.Mainhand, undefined);
                    player.playSound("random.break"); 
                    player.sendMessage("§cO Vein Buster destruiu sua ferramenta!");
                } else {
                    durabilidade.damage = novoDano;
                    equipComponent.setEquipment(EquipmentSlot.Mainhand, ferramenta);
                }
            }
        }
    }
});


world.afterEvents.itemUse.subscribe((event) => {
    const { source, itemStack } = event;

    if (source.typeId !== "minecraft:player") return;

    const itemId = itemStack.typeId;
    if (!itemId.includes("pickaxe") && !itemId.includes("axe") && !itemId.includes("shovel")) return;

    if (source.isSneaking) {
        let modoAtualIndex = 0;
        for (let i = 0; i < MODOS.length; i++) {
            if (source.hasTag("modo_" + MODOS[i].id)) {
                modoAtualIndex = i;
                break;
            }
        }

        MODOS.forEach(modo => source.removeTag("modo_" + modo.id));

        let proximoModoIndex = (modoAtualIndex + 1) % MODOS.length;
        let proximoModo = MODOS[proximoModoIndex];
        
        source.addTag("modo_" + proximoModo.id);

        source.onScreenDisplay.setActionBar(`§eModo: §a${proximoModo.nome}`);
        source.playSound("random.orb", { pitch: 1.5, volume: 0.5 });
    }
});