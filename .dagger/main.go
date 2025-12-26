package main

import (
	"context"

	"golang.org/x/sync/errgroup"

	"dagger/macroservices-invoice-renderer/internal/dagger"
)

const (
	nodeJSVersion = "16"
)

type MacroservicesInvoiceRenderer struct {
	// Source code directory
	// +private
	Source *dagger.Directory
	// +private
	InfisicalClientSecret *dagger.Secret
}

func New(
	// Source code directory
	// +defaultPath="."
	source *dagger.Directory,
	// Infisical client secret
	infisicalClientSecret *dagger.Secret,
) *MacroservicesInvoiceRenderer {
	return &MacroservicesInvoiceRenderer{
		Source:                source,
		InfisicalClientSecret: infisicalClientSecret,
	}
}

// CI runs the complete CI pipeline
func (m *MacroservicesInvoiceRenderer) CI(ctx context.Context) error {
	g, ctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		backend := dag.NodeCi(m.Source.Directory("backend"), dagger.NodeCiOpts{
			NodeVersion: nodeJSVersion,
		})

		_, err := backend.
			Install().
			WithTest().
			WithLint().
			WithExec("check-prettier").
			Stdout(ctx)

		return err
	})

	g.Go(func() error {
		frontend := dag.NodeCi(m.Source.Directory("frontend"), dagger.NodeCiOpts{
			NodeVersion: nodeJSVersion,
		})

		_, err := frontend.
			Install().
			WithLint().
			WithExec("check-prettier").
			Build(dagger.NodeCiBuildOpts{
				UseNextCache: true,
			}).
			Stdout(ctx)
		return err
	})

	return g.Wait()
}

// BuildAndPush builds and pushes the Docker image to the container registry
func (m *MacroservicesInvoiceRenderer) BuildAndPush(
	ctx context.Context,
	// +default="prod"
	env string,
	repoName string,
) error {
	g, ctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		_, err := dag.Docker(m.Source.Directory("backend"), m.InfisicalClientSecret, repoName+"-backend", dagger.DockerOpts{
			Environment: env,
		}).Build().Publish(ctx)

		return err
	})

	g.Go(func() error {
		_, err := dag.Docker(m.Source.Directory("frontend"), m.InfisicalClientSecret, repoName+"-frontend", dagger.DockerOpts{
			Environment: env,
		}).Build().Publish(ctx)

		return err
	})

	return g.Wait()
}
