# ⛏️ Vein Buster Mod (Minecraft Bedrock)

An efficient, lightweight Behavior Pack for Minecraft Bedrock Edition that allows players to mine entire ore veins and chop down whole trees in a single swing. Built using the modern **Minecraft Bedrock Script API (JavaScript)**.

Inspired by popular Java mods like *FTB Ultimine*, *VeinMiner*, and *Treecapitator*.

## ✨ Features

* **Smart Chain Reaction:** Destroys connected blocks of the same type (logs or ores) using a custom 3D flood-fill algorithm.
* **Native Integration:** Triggers only when the player is **sneaking** (crouching). If standing normally, blocks break one by one.
* **Balanced Gameplay:** Dynamically calculates the exact number of blocks broken and applies the correct amount of damage to the player's equipped tool. The tool will break if it runs out of durability.
* **Lag Protection:** Hard-capped at 64 blocks per swing to prevent server/world lag or crashes.
* **Redstone Support:** Includes logic to treat lit and unlit redstone ores as the same block.

## ⚙️ Requirements

This add-on uses the `@minecraft/server` module. To use this mod in your world, you **must** enable the following setting in your World Experiments:
* ✅ **Beta APIs**

## 🚀 Installation (Players)

1. Download the latest `VeinBuster.mcpack` from the [Releases](../../releases) tab.
2. Double-click the file to import it into Minecraft Bedrock automatically.
3. Apply the Behavior Pack to your world settings.
4. Enable **Beta APIs** in the Experiments tab.
5. Sneak, swing, and enjoy!

## 💻 Code Structure (Developers)

If you want to contribute or see how the code works, here is the basic structure:

```text
VeinBuster_BP/
├── manifest.json       # Pack metadata and Script API module dependencies
├── pack_icon.png       # 256x256 square icon
└── scripts/
    └── main.js         # Core logic (Flood-fill algorithm and durability handler)