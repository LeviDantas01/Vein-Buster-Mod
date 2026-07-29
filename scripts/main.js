import { world, EquipmentSlot } from "@minecraft/server";

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const { block, brokenBlockPermutation, player } = event;
    const blockId = brokenBlockPermutation.type.id;
    const dimension = block.dimension;

    if (player.isSneaking && (blockId.includes("log") || blockId.includes("ore"))) {
        
        const blocosQuebrados = quebrarEmCadeia(block.location, blockId, dimension);
        
        const equipComponent = player.getComponent("minecraft:equippable");
        const ferramenta = equipComponent.getEquipment(EquipmentSlot.Mainhand);
        
        if (ferramenta && blocosQuebrados > 0) {
            const durabilidade = ferramenta.getComponent("minecraft:durability");
            
            if (durabilidade) {
                const novoDano = durabilidade.damage + blocosQuebrados;
                
                if (novoDano >= durabilidade.maxDurability) {
                    equipComponent.setEquipment(EquipmentSlot.Mainhand, undefined);
                    player.playSound("random.break"); 
                } else {
                    durabilidade.damage = novoDano;
                    equipComponent.setEquipment(EquipmentSlot.Mainhand, ferramenta);
                }
            }
        }
    }
});

function quebrarEmCadeia(startLocation, blockId, dimension) {
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
                        } catch (e) {
                           
                        }
                    }
                }
            }
        }
    }
    
    return brokenCount; 
}