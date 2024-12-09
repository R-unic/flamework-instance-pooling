import { Flamework } from "@flamework/core";
import { Component } from "@flamework/components";
import { $nameof } from "rbxts-transform-debug";

import { InstancePool, PoolableInstance } from "./instance-pool";

@Component({ tag: $nameof<PoolableUI>() })
export class PoolableUI<I extends GuiObject = GuiObject> extends PoolableInstance<I> {
  public initialize(returnFunction: () => void): void {
    super.initialize(returnFunction);
    this.instance.Visible = true;
  }

  public returnToPool(): void {
    super.returnToPool();
    this.instance.Visible = false;
  }
}

export class UIPool<I extends GuiObject = GuiObject> extends InstancePool<PoolableUI<I>> {
  public constructor(prefab: I, parent?: Instance, fillAmount?: number, whenNoInstances?: () => PoolableUI<I>) {
    super(Flamework.id<PoolableUI>(), prefab, parent, fillAmount, whenNoInstances);
  }

  public override take(position?: UDim2): PoolableUI<I> {
    const ui = super.take();
    if (position !== undefined)
      ui.instance.Position = position;

    return ui;
  }
}