import { Flamework } from "@flamework/core";
import { Component } from "@flamework/components";
import { $nameof } from "rbxts-transform-debug";

import { InstancePool, PoolableInstance, type InstancePoolOptions } from "./instance-pool";

@Component({ tag: $nameof<PoolablePart>() })
export class PoolablePart<I extends BasePart = BasePart> extends PoolableInstance<I> {
  public returnToPool(): void {
    super.returnToPool();
    this.instance.CFrame = new CFrame(0, 1e8, 0);
  }
}

export class PartPool<I extends Part = Part> extends InstancePool<PoolablePart<I>> {
  public constructor(options: InstancePoolOptions<PoolablePart<I>>) {
    super(Flamework.id<PoolablePart>(), options);
  }

  public override take(cframe?: CFrame): PoolablePart<I> {
    const part = super.take();
    if (cframe !== undefined)
      part.instance.CFrame = cframe;

    return part;
  }
}