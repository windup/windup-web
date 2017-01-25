package org.jboss.windup.web.addons.websupport.services.dependencies;

/**
 * Edge in dependencies report graph
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class GraphEdge
{
    protected Long from;
    protected Long to;

    protected Object data;

    public GraphEdge(Long from, Long to)
    {
        this.from = from;
        this.to = to;
    }

    public GraphEdge(Long from, Long to, Object data)
    {
        this.from = from;
        this.to = to;
        this.data = data;
    }

    public Long getFrom()
    {
        return from;
    }

    public Long getTo()
    {
        return to;
    }

    public Object getData()
    {
        return data;
    }

    public void setData(Object data)
    {
        this.data = data;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        GraphEdge graphEdge = (GraphEdge) o;

        if (from != null ? !from.equals(graphEdge.from) : graphEdge.from != null)
            return false;

        return to != null ? to.equals(graphEdge.to) : graphEdge.to == null;
    }

    @Override
    public int hashCode()
    {
        int result = from != null ? from.hashCode() : 0;
        result = 31 * result + (to != null ? to.hashCode() : 0);

        return result;
    }
}
