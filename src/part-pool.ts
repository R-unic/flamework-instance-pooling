import { Flamework } from "@flamework/core";
import { Component } from "@flamework/components";
import { $nameof } from "rbxts-transform-debug";

import { InstancePool, PoolableInstance } from "./instance-pool";

@Component({ tag: $nameof<PoolablePart>() })
export class PoolablePart<I extends BasePart = BasePart> extends PoolableInstance<I> {
  private returnFunction?: (poolable: PoolablePart<I>) => void;

  public initialize(returnFunction: (poolable: PoolablePart<I>) => void): void {
    this.returnFunction = returnFunction;
  }

  public returnToPool(): void {
    this.returnFunction?.(this);
    this.instance.CFrame = new CFrame(0, 1e8, 0);
  }
}

export class PartPool<I extends Part = Part> extends InstancePool<PoolablePart<I>> {
  public constructor(prefab: I, parent?: Instance, fillAmount?: number, whenNoInstances?: () => PoolablePart<I>) {
    super(Flamework.id<PoolablePart>(), prefab, parent, fillAmount, whenNoInstances);
  }

  public override take(cframe?: CFrame): PoolablePart<I> {
    const part = super.take();
    if (cframe !== undefined)
      part.instance.CFrame = cframe;

    return part;
  }
}