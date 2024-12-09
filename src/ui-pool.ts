import { Flamework } from "@flamework/core";
import { Component } from "@flamework/components";
import { $nameof } from "rbxts-transform-debug";

import { InstancePool, PoolableInstance, type InstancePoolOptions } from "./instance-pool";

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
  public constructor(options: InstancePoolOptions<PoolableUI<I>>) {
    super(Flamework.id<PoolableUI>(), options);
  }

  public override take(position?: UDim2): PoolableUI<I> {
    const ui = super.take();
    if (position !== undefined)
      ui.instance.Position = position;

    return ui;
  }
}