# ⛏️ Vein Buster Mod (Minecraft Bedrock)

An efficient, lightweight Behavior Pack for Minecraft Bedrock Edition that brings advanced mining mechanics to your game. Built using the modern **Minecraft Bedrock Script API (JavaScript)**.

Inspired by popular Java mods like *FTB Ultimine*, *VeinMiner*, and *Treecapitator*, but fully adapted for the Bedrock ecosystem.

## ✨ Features

* **7 Smart Mining Modes:**
  * **Vein / Treecapitator:** Destroys connected blocks of the same type (logs or ores) using a custom 3D flood-fill algorithm.
  * **Tunnels (1x1, 2x2, 3x3):** Mines perfectly straight tunnels based on the player's view direction. 
  * **Stairs (1x1, 2x2, 3x3):** Mines angled tunnels going up or down, automatically adjusting height per step.
* **Dynamic Depth Calculation:** The mod dynamically calculates how far a tunnel can go based on a hard limit of 64 blocks per swing. A 3x3 tunnel will go 7 blocks deep, while a 1x1 tunnel will reach 64 blocks forward instantly!
* **Native Integration:** Triggers only when the player is **sneaking** (crouching). If standing normally, blocks break one by one.
* **Balanced Gameplay:** Dynamically applies the exact amount of damage to the player's equipped tool based on the number of blocks destroyed.
* **Redstone Support:** Includes logic to treat lit and unlit redstone ores as the same block.

## 🎮 How to Use

1. **Equip your tool** (Axe, Pickaxe, or Shovel).
2. **Switch Modes:** Sneak (crouch) and **Right-Click** (or long-press the screen) in the air to cycle through the mining modes. An action bar message will confirm the active mode.
3. **Mine:** Sneak and break a block. Watch the magic happen!

## ⚙️ Requirements

This add-on uses the `@minecraft/server` module. To use this mod in your world, you **must** enable the following setting in your World Experiments:
* ✅ **Beta APIs**

## 🚀 Installation (Players)

1. Download the latest `VeinBuster.mcpack` from the [Releases](../../releases) tab.
2. Double-click the file to import it into Minecraft Bedrock automatically.
3. Apply the Behavior Pack to your world settings.
4. Enable **Beta APIs** in the Experiments tab.

## 💻 Code Structure (Developers)

If you want to contribute or see how the code works, the architecture is centralized and parametric:

```text
VeinBuster_BP/
├── manifest.json       # Pack metadata and Script API module dependencies
├── pack_icon.png       # 256x256 square icon
└── scripts/
    └── main.js         # Core logic (Parametric math, Flood-fill, and tool durability