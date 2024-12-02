import { Flamework } from "@flamework/core";
import { Component } from "@flamework/components";
import { $nameof } from "rbxts-transform-debug";

import { InstancePool, PoolableInstance } from "./instance-pool";

@Component({ tag: $nameof<PoolablePart>() })
export class PoolablePart extends PoolableInstance<BasePart> {
  private returnFunction?: (poolable: PoolablePart) => void;

  public initialize(returnFunction: (poolable: PoolablePart) => void): void {
    this.returnFunction = returnFunction;
  }

  public returnToPool(): void {
    this.returnFunction?.(this);
    this.instance.CFrame = new CFrame(0, 1e8, 0);
  }
}

export class PartPool extends InstancePool<PoolablePart> {
  public constructor(prefab: BasePart, parent?: Instance, fillAmount?: number) {
    super(Flamework.id<PoolablePart>(), prefab, parent, fillAmount);
  }

  public override take(cframe?: CFrame): PoolablePart {
    const part = super.take();
    if (cframe !== undefined)
      part.instance.CFrame = cframe;

    return part;
  }
}