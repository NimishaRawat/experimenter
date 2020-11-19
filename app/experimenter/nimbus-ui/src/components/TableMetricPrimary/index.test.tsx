/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import { render, screen } from "@testing-library/react";
import TableMetricPrimary from ".";
import { mockExperimentQuery } from "../../lib/mocks";
import { mockAnalysis } from "../../lib/visualization/mocks";
import { RouterSlugProvider } from "../../lib/test-utils";

describe("TableMetricPrimary", () => {
  it("has the correct headings", async () => {
    const EXPECTED_HEADINGS = [
      "Conversions / Total Users",
      "Conversion Rate",
      "Relative Improvement",
    ];
    const { mock, data } = mockExperimentQuery("demo-slug");

    render(
      <RouterSlugProvider mocks={[mock]}>
        <TableMetricPrimary
          results={mockAnalysis().overall}
          probeSet={data!.primaryProbeSets![0]}
        />
      </RouterSlugProvider>,
    );

    EXPECTED_HEADINGS.forEach((heading) => {
      expect(screen.getByText(heading)).toBeInTheDocument();
    });
  });

  it("has correctly labelled result significance", async () => {
    const { mock, data } = mockExperimentQuery("demo-slug");

    render(
      <RouterSlugProvider mocks={[mock]}>
        <TableMetricPrimary
          results={mockAnalysis().overall}
          probeSet={data!.primaryProbeSets![0]}
        />
      </RouterSlugProvider>,
    );

    const negativeSignificance = screen.queryByTestId("negative-significance");
    const neutralSignificance = screen.queryByTestId("neutral-significance");

    expect(screen.getByTestId("positive-significance")).toBeInTheDocument();
    expect(negativeSignificance).not.toBeInTheDocument();
    expect(neutralSignificance).not.toBeInTheDocument();
  });

  it("has the expected control and treatment labels", async () => {
    const { mock, data } = mockExperimentQuery("demo-slug");

    render(
      <RouterSlugProvider mocks={[mock]}>
        <TableMetricPrimary
          results={mockAnalysis().overall}
          probeSet={data!.primaryProbeSets![0]}
        />
      </RouterSlugProvider>,
    );

    expect(screen.getAllByText("control")).toHaveLength(2);
    expect(screen.getByText("treatment")).toBeInTheDocument();
  });

  it("shows the positive improvement bar", async () => {
    const { mock, data } = mockExperimentQuery("demo-slug");

    render(
      <RouterSlugProvider mocks={[mock]}>
        <TableMetricPrimary
          results={mockAnalysis().overall}
          probeSet={data!.primaryProbeSets![0]}
        />
      </RouterSlugProvider>,
    );

    const negativeBlock = screen.queryByTestId("negative-block");
    const neutralBlock = screen.queryByTestId("neutral-block");

    expect(screen.getByTestId("positive-block")).toBeInTheDocument();
    expect(negativeBlock).not.toBeInTheDocument();
    expect(neutralBlock).not.toBeInTheDocument();
  });

  it("shows the negative improvement bar", async () => {
    const { mock, data } = mockExperimentQuery("demo-slug", {
      primaryProbeSets: [
        {
          __typename: "NimbusProbeSetType",
          slug: "feature_b",
          name: "Feature B",
        },
      ],
    });

    render(
      <RouterSlugProvider mocks={[mock]}>
        <TableMetricPrimary
          results={mockAnalysis().overall}
          probeSet={data!.primaryProbeSets![0]}
        />
      </RouterSlugProvider>,
    );

    const positiveBlock = screen.queryByTestId("positive-block");
    const neutralBlock = screen.queryByTestId("neutral-block");

    expect(screen.getByTestId("negative-block")).toBeInTheDocument();
    expect(positiveBlock).not.toBeInTheDocument();
    expect(neutralBlock).not.toBeInTheDocument();
  });

  it("shows the neutral improvement bar", async () => {
    const { mock, data } = mockExperimentQuery("demo-slug", {
      primaryProbeSets: [
        {
          __typename: "NimbusProbeSetType",
          slug: "feature_c",
          name: "Feature C",
        },
      ],
    });

    render(
      <RouterSlugProvider mocks={[mock]}>
        <TableMetricPrimary
          results={mockAnalysis().overall}
          probeSet={data!.primaryProbeSets![0]}
        />
      </RouterSlugProvider>,
    );

    const negativeBlock = screen.queryByTestId("negative-block");
    const positiveBlock = screen.queryByTestId("positive-block");

    expect(screen.getByTestId("neutral-block")).toBeInTheDocument();
    expect(negativeBlock).not.toBeInTheDocument();
    expect(positiveBlock).not.toBeInTheDocument();
  });
});